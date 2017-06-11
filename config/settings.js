/**
 * Config settings
 */

const path = require('path');
const program = require('commander');

const DB_URL = process.env.NODE_ENV !== 'production' ? 'localhost:5432' : process.env.DB_URL;
const DB_NAME = process.env.DB_NAME !== undefined ? process.env.DB_NAME : 'rtkb';
const DB_USER = process.env.DB_USER !== undefined ? process.env.DB_USER : 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
const CRYPTO_PASSWORD = process.env.CRYPTO_PASSWORD !== undefined ? process.env.CRYPTO_PASSWORD : '';

var options = {
    rootPath: path.normalize(__dirname + '/../'),
    cryptoPassword: CRYPTO_PASSWORD,
    db: {
        url: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}`,
        name: DB_NAME,
    },
};

module.exports = options;
