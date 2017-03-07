
var passport = require('passport');
var isAuthenticated = require('../user/UserService.js');

module.exports = function (app) {
    app.get('/api/google/auth',
        isAuthenticated,
        passport.authorize('google', {scope: 'https://www.googleapis.com/auth/plus.login'}),
        function (req, res) {
            console.log('GoogleController -> auth -> called');
        });
        
    app.get('/api/google/callback',
        passport.authorize('google', { failureRedirect: '/' }),
        function (req, res) {
            console.log('GoogleController -> callback -> called');
            res.sendStatus(200);
        });
        
}