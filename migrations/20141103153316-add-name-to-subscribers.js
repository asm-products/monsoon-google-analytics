"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('subscribers', 'name', DataTypes.STRING).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn('subscribers', 'name').done(done);
  }
};
