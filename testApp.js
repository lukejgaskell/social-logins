var express = require('express');
var app = module.exports = express();

var server_ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 4000;
var properties = require('./properties.js');
var db = require('./DatabaseConfig');

require('./Social-Login')(app, properties, db);


app.listen(server_port, server_ipaddress, function() { 
  console.log('notificationdashboard listening on port ' + server_port + '!');
});