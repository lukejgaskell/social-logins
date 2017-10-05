
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var properties = require('./properties');

var connection_string = properties.database.url;

mongoose.Promise = bluebird;
mongoose.connect(connection_string, {useMongoClient: true});
var db = mongoose.connection;

module.exports = db;