"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const config = require('../../config/settings');
const chalk = require('chalk');
var sequelize = new Sequelize(config.db.url, {
  logging: process.env.NODE_ENV === 'development' ? true : false,
});
sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(function(err) {
    console.log(chalk.green('[DB] Connected to ' + config.db.name));
  })
  .catch(function (err) {
    console.error(chalk.red('[ERROR] Could not connect to PostgreSQL!'));
    console.log(chalk.red(err));
    process.exit(1);
  });


var db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
