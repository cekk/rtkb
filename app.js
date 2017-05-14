const Glue = require('glue');
const chalk = require('chalk');
const manifest = require('./config/manifest.json');
const models = require('./lib/models');
// const glob = require('glob');
const config = require('./config/settings');
const Labbable = require('labbable');

const labbable = module.exports = new Labbable();
const options = {
  relativeTo: __dirname + '/lib/modules'
};

Glue.compose(manifest, options, function (err, server) {
  // Show the server to our instance of labbable
  labbable.using(server);
  server.start(function (err) {
    for ( var key of Object.keys(server.connections) ) {
      console.info( chalk.bold.green( '==> 🌎 Hapi Server (' + server.connections[key].labels + ') is listening on', server.connections[key].info.uri ));
    }
  });
});
