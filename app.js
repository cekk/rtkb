const Glue = require('glue');
const chalk = require('chalk');
const manifest = require('./config/manifest.json');
const mongoose = require('mongoose');
// const glob = require('glob');
const config = require('./config/settings');

const options = {
  relativeTo: __dirname + '/lib/modules'
};

// Bootstrap db connection
var db = mongoose.connect(config.db.url + '/' + config.db.name, function (err) {
    if (err) {
        console.error(chalk.red('[ERROR] Could not connect to MongoDB!'));
        console.log(chalk.red(err));
        process.exit(1);
    }
    else {
      console.log(chalk.green('[DB] Connected to ' + config.db.url + '/' + config.db.name));
    }
});


const Server =  require('./lib/modules/servers/models');

// // Bootstrap models
// var models = glob.sync(config.rootPath + "models/**/*.js");
// models.forEach(function (modelPath) {
//     require(path.resolve(modelPath));
// });

Glue.compose(manifest, options, function (err, server) {
  server.start(function (err) {
    for ( var key of Object.keys(server.connections) ) {
      console.info( chalk.bold.green( '==> 🌎 Hapi Server (' + server.connections[key].labels + ') is listening on', server.connections[key].info.uri ));
    }
  });
});

exports.db = db;
