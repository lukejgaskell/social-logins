
var passport = require('passport');
var isAuthenticated = require('../user/UserService.js');
var request = require('request');

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

    app.get('/api/facebook/notifications',
        isAuthenticated,
        function (req, res) {
            console.log('FacebookController -> notifications -> called');
            request.get({
                url: 'https://graph.facebook.com' + '/v2.8/' + req.user.facebook.id + '?notifications'
                + '&access_token=' + req.user.facebook.accessToken
            }, function (err, response, body) {
                //it works!
                res.send(body);
            });
        });
        
}