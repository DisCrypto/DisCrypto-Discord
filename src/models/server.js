'use strict';
module.exports = function(sequelize, DataTypes) {
  var Server = sequelize.define('Server', {
    id: DataTypes.STRING,
    prefix: DataTypes.STRING
  }, {
    tableName: "servers",
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};