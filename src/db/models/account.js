'use strict';
module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
    id: { type: DataTypes.STRING, primaryKey: true },
    guid: DataTypes.STRING,
    username: DataTypes.STRING,
    balance: DataTypes.DECIMAL(15, 15)
  }, {
    tableName: "accounts",
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Account;
};