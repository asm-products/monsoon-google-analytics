module.exports = function(sequelize, DataTypes) {
  var Subscriber = sequelize.define('Subscriber', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    sent_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    endpoint: {
      type: DataTypes.STRING
    },
    product: {
      type: DataTypes.STRING
    },
    access_token: {
      type: DataTypes.STRING
    },
    refresh_token: DataTypes.STRING,
    token_type: DataTypes.STRING,
    account_name: DataTypes.STRING,
    property_name: DataTypes.STRING,
    profile_name: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'subscribers',
    deletedAt: 'deleted_at',
    paranoid: true
  });

  return Subscriber;
};
