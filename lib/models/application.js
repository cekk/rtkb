"use strict";

module.exports = function(sequelize, DataTypes) {
  var Application = sequelize.define("Application", {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT
    },
    infos: {
      type: DataTypes.TEXT
    },
    buildoutRepository: {
      type: DataTypes.STRING
    },
    secrets: {
      type: DataTypes.JSON
    }
  },
  {
    classMethods: {
      associate: function(models) {
        Application.belongsTo(models.Server);
      }
    }
  });

  return Application;
};
