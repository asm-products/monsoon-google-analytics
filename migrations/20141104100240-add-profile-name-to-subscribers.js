"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('subscribers', 'profile_name', DataTypes.STRING).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('subscribers', 'profile_name').done(done);
  }
};
