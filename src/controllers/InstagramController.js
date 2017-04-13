
var passport = require('passport');
var isAuthenticated = require('../user/UserService');


class InstagramController {
    createRoute(app) {
        app.get('/api/instagram/auth',
            this.instagramAuth);
        app.get('/api/instagram/callback',
            this.instagramCallback);
        app.get('/api/instagram/connect',
            isAuthenticated,
            this.instagramConnect);
    }

    instagramAuth(req, res) {
        console.log('InstagramController -> auth -> called');
        passport.authenticate('instagram')(req, res);
    }

    instagramConnect(req, res) {
        console.log('InstagramController -> connect -> called');
        passport.authorize('instagram')(req, res);
    }

    instagramCallback(req, res) {
        console.log('InstagramController -> connect callback -> called');
        passport.authorize('instagram', (err, user) => {
            if (err) {
                console.log('InstagramController -> connect callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('InstagramController -> connect callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

}

module.exports = new InstagramController();