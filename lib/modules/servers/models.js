var mongoose = require('mongoose');

var serverSchema = mongoose.Schema({
    name: String,
    commonName: String,
    ip: String,
    dataCenterName: String,
    description: String
});

var Server = mongoose.model('Server', serverSchema);

exports.Server = Server;
