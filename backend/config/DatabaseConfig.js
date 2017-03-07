
var mongoose = require('mongoose');
var connection_string = 'mongodb://localhost/dashboard';

if(process.env.OPENSHIFT_MONGODB_DB_USERNAME){
  connection_string = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' + 
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' + 
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + 
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' + 
  process.env.OPENSHIFT_APP_NAME
}

mongoose.connect(connection_string);
var db = mongoose.connection;

module.exports = db;