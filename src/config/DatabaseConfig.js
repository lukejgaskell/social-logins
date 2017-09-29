
var bluebird = require('bluebird');
var mongoose = require('mongoose');

if (!process.env.MONGO_URL) {
    process.env.MONGO_URL = 'mongodb://mongo/accounts';
}
var connection_string = process.env.MONGO_URL;

mongoose.Promise = bluebird;
mongoose.connect(connection_string, {useMongoClient: true});
var db = mongoose.connection;

module.exports = db;