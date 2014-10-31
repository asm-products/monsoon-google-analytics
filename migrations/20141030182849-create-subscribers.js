"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('subscribers', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      sent_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
      endpoint: {
        type: DataTypes.STRING,
        allowNull: false
      },
      product: {
        type: DataTypes.STRING,
        allowNull: false
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      refresh_token: DataTypes.STRING,
      token_type: DataTypes.STRING
    }).done(done);
  },

  down: function(migration, DataTypes, done) {
    migration.dropTable('subscribers').done(done);
  }
};
