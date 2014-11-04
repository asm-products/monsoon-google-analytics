var Agenda = require('agenda');
var google = require('googleapis');
var request = require('request');
var models = require('../models');
var QueryInterface = require('./query_interface');

var agenda = new Agenda({ db: { address: process.env.MONGOHQ_URL, collection: 'agenda_jobs' } });
var oauthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
var Subscriber = models.Subscriber;

agenda.processEvery('1 hour');

agenda.define('getSubscribers', function(job, done) {
  Subscriber.findAll()
  .then(function(subscribers) {
    subscribers.forEach(function(subscriber) {
      agenda.now('queryGoogle', { subscriber: subscriber });
    });

    done();
  })
  .catch(function(err) {
    console.error('Unable to query Google');
    console.log(err);
  });
});


// Welcome to callback hell :(

agenda.define('queryGoogle', function(job, done) {
  var subscriber = job.data.subscriber;
  var accessToken = subscriber.get('access_token');
  var refreshToken = subscriber.get('refresh_token');
  var accountName = subscriber.get('account_name');
  var propertyName = subscriber.get('property_name');
  var profileName = subscriber.get('profile_name');

  oauthClient.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  var queryInterface = new QueryInterface(oauthClient);

  queryInterface.listUserAccounts(function(err, response) {
    if (err) {
      console.error('Error listing user accounts.');
      return done(err);
    }

    var account = getByName(response.items, accountName);

    if (!account) {
      return done(new Error('No account name matched ' + accountName));
    }

    var accountId = account.id;

    queryInterface.listWebProperties(accountId, function(err, response) {
      if (err) {
        console.error('Error listing web properties');
        return done(err);
      }

      var property = getByName(response.items, propertyName);

      if (!property) {
        return done(new Error('No property name matched ' + propertyName));
      }

      var propertyId = property.id;

      queryInterface.listProfiles(accountId, propertyId, function(err, response) {
        if (err) {
          console.error('Error listing profiles');
          return done(err);
        }

        var profile = getByName(response.items, profileName);

        if (!profile) {
          return done(new Error('No profile name matched ' + profileName));
        }

        var profileId = profile.id;

        queryInterface.getData(profileId, function(err, response) {
          if (err) {
            console.error('Error retrieving data');
            return done(err);
          }

          var totals = response.totalsForAllResults;
          var newUsers = totals['ga:newUsers'];
          var sessions = totals['ga:sessions'];
          var endpoint = subscriber.get('endpoint');
          var message = 'There were ' + newUsers + ' new users across ' +
            sessions + ' sessions last week.';

          request({
            method: 'POST',
            uri: endpoint,
            body: {
              message: message,
              user_token: process.env.ASSEMBLY_AUTHENTICATION_TOKEN
            },
            json: true
          }, function(err, response, body) {
            if (err) {
              console.log('Error sending message to ' + endpoint);
              return done(err);
            }

            console.log(response.statusCode);
            console.log(body);
            done();
          });
        });
      });
    });
  });
});

function getByName(list, name) {
  for (var i = 0, l = list.length; i < l; i++) {
    if (list[i].name === name) {
      return list[i];
    }
  }

  return null;
}

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

agenda.every('7 days', 'getSubscribers');

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

module.exports = agenda.start();
