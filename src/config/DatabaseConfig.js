
var bluebird = require('bluebird');
var mongoose = require('mongoose');
var properties = require('./properties');


var connection_string = 'mongodb://' + properties.database.url + '/' + properties.database.name;

mongoose.Promise = bluebird;
mongoose.connect(connection_string);
var db = mongoose.connection;

module.exports = db;