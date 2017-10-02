

var express = require('express');
var app = express();

var path = require('path');

var db = require('./config/DatabaseConfig');
var passportConfig = require("./config/PassportConfig");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require("./routes");

const PORT = 8000;
const HOST = '0.0.0.0';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
passportConfig.configure(app);

routes.createRoutes(app);


app.listen(PORT, HOST, () => {
    console.log(`listening on http://${HOST}:${PORT}!`);
});