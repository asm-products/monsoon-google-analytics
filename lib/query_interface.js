var google = require('googleapis');
var analyticsClient = google.analytics('v3');

var SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

var QueryInterface = function(oauthClient) {
  this.oauthClient = oauthClient;
};

QueryInterface.prototype.listUserAccounts = function(callback) {
  analyticsClient.management.accounts.list(
    { auth: this.oauthClient },
    callback
  );
};

QueryInterface.prototype.listWebProperties = function(accountId, callback) {
  analyticsClient.management.webproperties.list(
    {
      auth: this.oauthClient,
      accountId: accountId
    },
    callback
  );
};

QueryInterface.prototype.listProfiles = function(accountId, propertyId, callback) {
  analyticsClient.management.profiles.list(
    {
      auth: this.oauthClient,
      accountId: accountId,
      webPropertyId: propertyId
    },
    callback
  );
};

QueryInterface.prototype.getData = function(profileId, callback) {
  analyticsClient.data.ga.get(
    {
      auth: this.oauthClient,
      ids: 'ga:' + profileId,
      // dimensions: 'ga:fullReferrer',
      metrics: 'ga:newUsers,ga:sessions',
      'start-date': '7daysAgo',
      'end-date': 'today'
    },
    callback
  )
};

module.exports = QueryInterface;
