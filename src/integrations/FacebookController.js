
var passport = require('passport');
var isAuthenticated = require('../user/UserService.js');

module.exports = function (app) {
    app.get('/api/facebook/auth',
        isAuthenticated,
        passport.authorize('facebook'),
        function (req, res) {
            console.log('FacebookController -> auth -> called');
        });
        
    app.get('/api/facebook/callback',
        passport.authorize('facebook', { failureRedirect: '/' }),
        function (req, res) {
            console.log('FacebookController -> callback -> called');
            res.sendStatus(200);
        });
        
}