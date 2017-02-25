var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

const mongodbErrorHandler = require('mongoose-mongodb-errors');


var serverSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    commonName: String,
    ip: String,
    dataCenterName: String,
    description: String
});

// serverSchema.plugin(mongodbErrorHandler);
serverSchema.index({name: 1}, {unique: true});
var Server = mongoose.model('Server', serverSchema);

exports.Server = Server;
