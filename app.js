var express = require('express');
var app = module.exports = express();

var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var server_ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 4000;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require("./backend/config/DatabaseConfig.js");
require("./backend/config/SessionConfig.js")(app);
require("./backend/config/PassportConfig.js")(app);
require("./backend/routes.js")(app);

app.get('/health', function (req, res) {
  res.sendStatus(200);
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(server_port, server_ipaddress, function() { 
  console.log('notificationdashboard listening on port ' + server_port + '!');
});