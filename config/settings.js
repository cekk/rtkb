/**
 * Config settings
 */

const path = require('path');
const program = require('commander');

const DB_PATH = process.env.NODE_ENV !== 'development' ? 'localhost:27017' : process.env.DB_PATH;

var options = {
    rootPath: path.normalize(__dirname + '/../'),
    db: {
        url: 'mongodb://' + DB_PATH,
        name: process.env.DB_NAME || 'rtkb'
    },
};

module.exports = options;
