"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.renameColumn('subscriptions', 'name', 'account_name').done(function() {
      migration.addColumn('subscribers', 'property_name', DataTypes.STRING).done(done);
    });
  },

  down: function(migration, DataTypes, done) {
    migration.renameColumn('subscriptions', 'account_name', 'name').done(function() {
      migration.dropColumn('subscribers', 'property_name').done(done);
    });
  }
};
