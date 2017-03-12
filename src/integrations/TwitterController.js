
var passport = require('passport');
var isAuthenticated = require('../user/UserService.js');

module.exports = function (app) {
    app.get('/api/twitter/auth',
    isAuthenticated,
        passport.authorize('twitter'),
        function (req, res) { 
         console.log('TwitterController -> auth -> called');
        });
    app.get('/api/twitter/callback',
        passport.authorize('twitter', { failureRedirect: '/' }),
        function (req, res) {
            console.log('TwitterController -> callback -> called');
            res.sendStatus(200);
        });
}