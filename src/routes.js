
var FacebookController = require('./controllers/FacebookController.js');
var TwitterController = require('./controllers/TwitterController.js');
var InstagramController = require('./controllers/InstagramController.js');
var GoogleController = require('./controllers/GoogleController.js');
var LoginController = require('./controllers/LoginController.js');
var UserController = require('./controllers/UserController.js');

class Routes {
    createRoutes(app) {
        LoginController.createRoute(app);
        UserController.createRoute(app);
        FacebookController.createRoute(app);
        TwitterController.createRoute(app);
        InstagramController.createRoute(app);
        GoogleController.createRoute(app);
    }
}

module.exports = new Routes();