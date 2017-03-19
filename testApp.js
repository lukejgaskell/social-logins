var express = require('express');
var app = module.exports = express();

var server_ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 4000;
var properties = require('./properties.js');
var db = require('./DatabaseConfig');
var mongoose = require('mongoose');

var SocialLogin = require('./Social-Login');
SocialLogin.init(app, properties, db, mongoose);

SocialLogin.models.User.findOne("lukejgaskell@gmail.com", function(err, user) {
         if (err)
             console.log("there was an error"); //do something else to handle the error
         else
             console.log("no error");
    });

app.listen(server_port, server_ipaddress, function() { 
  console.log('TestApp listening on port ' + server_port + '!');
});