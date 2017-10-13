

var express = require('express');
var app = express();

var path = require('path');

var properties = require('./config/properties');
var db = require('./config/DatabaseConfig');
var passportConfig = require("./config/PassportConfig");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var helmet = require('helmet');

const PORT = properties.port;
const HOST = properties.host;

var controllers = readDirectory('./src');

controllers.forEach(controllerFile => {
    require('../' + controllerFile)(app);
});
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
passportConfig.configure(app);

app.listen(PORT, HOST, () => {
    console.log(`listening on ${properties.protocol}://${HOST}:${PORT}!`);
});

function readDirectory(dir) {
    return fs.readdirSync(dir)
        .reduce((files, file) =>
            fs.statSync(path.join(dir, file)).isDirectory() ?
                files.concat(readDirectory(path.join(dir, file))) :
                files.concat(path.join(dir, file)),
        []).filter(file => file.includes('.controller'));
}