

var express = require('express');
var app = express();

var path = require('path');


var db = require('./config/DatabaseConfig.js');
var passportConfig = require("./config/PassportConfig");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require("./routes");

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const PORT = 8080;
const HOST = '0.0.0.0';

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    passportConfig.configure(app);

    routes.createRoutes(app);


    app.listen(PORT, HOST, () => {
        console.log(`listening on http://${HOST}:${PORT}!`);
    });

    console.log(`Worker ${process.pid} started`);
}