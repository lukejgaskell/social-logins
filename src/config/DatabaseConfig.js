
var bluebird = require('bluebird');
var mongoose = require('mongoose');


var connection_string = process.env.MONGO_URL;

mongoose.Promise = bluebird;
mongoose.connect(connection_string, {useMongoClient: true});
var db = mongoose.connection;

module.exports = db;