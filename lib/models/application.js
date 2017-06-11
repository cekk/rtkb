"use strict";
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const cryptoPassword = require('../../config/settings').cryptoPassword;

module.exports = function(sequelize, DataTypes) {

  const cryptSecrets = (secrets) => {
    const cipher = crypto.createCipher(algorithm, cryptoPassword);
    let crypted = cipher.update(JSON.stringify(secrets), 'utf8', 'hex');
    crypted += cipher.final('hex');
    console.log('QUI: ', crypted);
    return crypted;
  };

  const decryptSecrets = (text) => {
    const decipher = crypto.createDecipher(algorithm, cryptoPassword);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return JSON.parse(dec);
  }

  const Application = sequelize.define("Application", {
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
      type: DataTypes.JSON,
      set(value) {
        this.setDataValue('secrets', cryptSecrets(value));
      }
    }
  },
  {
    classMethods: {
      associate: function(models) {
        Application.belongsTo(models.Server);
      }
    },
    instanceMethods: {
      decryptSecrets: decryptSecrets,
    }
  });

  return Application;
};
