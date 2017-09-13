
var passport = require('passport');
var generateAccessToken = require('../user/UserService').generateAccessToken;

class FacebookController {
    createRoute(app) {
        app.get('/api/facebook/auth', this.facebookAuth);
        app.get('/api/facebook/callback', this.facebookCallback);
    }

    facebookAuth(req, res) {
        console.log('FacebookController -> auth -> called');
        passport.authenticate('facebook')(req, res);
    }

    async facebookCallback(req, res) {
        console.log('FacebookController -> auth callback -> called');

        passport.authorize('facebook', (err, user) => {
            if (err) {
                console.log('FacebookController -> auth callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('FacebookController -> auth callback -> no user');
                return res.sendStatus(400);
            }
            var token = generateAccessToken(user.id);
            return res.json({
                "auth": token
            });
        })(req, res);
    }
}

module.exports = new FacebookController();