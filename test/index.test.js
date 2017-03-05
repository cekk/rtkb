// load deps
const mongoose = require("mongoose");
const config = require('../config/settings');
const LabbableServer = require('../app.js');

let lab = exports.lab = require('lab').script();
global.expect = require('chai').expect;

// prepare environment
global. it = lab.it;
global.describe = lab.describe;
global.before = lab.before;
global.beforeEach = lab.beforeEach;

// get the server
let appServer;
global.server = appServer;

global.before((done) => [
  // Callback fires once the server is initialized
  // or immediately if the server is already initialized
  LabbableServer.ready((err, srv) => {

      if (err) {
          return done(err);
      }

      server = srv;

      return done();
  })
]);


const db = mongoose.createConnection(config.db.url + '/' + config.db.name);
global.db = db;
