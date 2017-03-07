
var passport = require('passport');
var isAuthenticated = require('../user/UserService.js');

module.exports = function (app) {
    app.get('/api/instagram/auth',
    isAuthenticated,
        passport.authorize('instagram'),
        function (req, res) { 
         console.log('InstagramController -> auth -> called');
        });
    app.get('/api/instagram/callback',
        passport.authorize('instagram', { failureRedirect: '/' }),
        function (req, res) {
            console.log('InstagramController -> callback -> called');
            res.sendStatus(200);
        });
}