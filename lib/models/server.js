"use strict";

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
  });

  return Server;
};
