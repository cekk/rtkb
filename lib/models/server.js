"use strict";
const db = require('./index');

module.exports = function(sequelize, DataTypes) {
  var Server = sequelize.define("Server", {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    commonName: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
    datacenterName: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    }
  },
  {
    classMethods: {
      associate: function(models) {
        Server.hasMany(models.Application, {as: 'applications'});
      }
    }
  });

  return Server;
};
