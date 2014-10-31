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
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    product: {
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    access_token: {
      type: DataTypes.STRING,
      validate: {
        notNull: true
      }
    },
    refresh_token: DataTypes.STRING,
    token_type: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'subscribers',
    deletedAt: 'deleted_at',
    paranoid: true
  });

  return Subscriber;
};
