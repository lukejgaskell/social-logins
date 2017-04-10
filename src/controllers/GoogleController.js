
var passport = require('passport');
var isAuthenticated = require('../user/UserService');

class GoogleController {
    createRoute(app) {
        app.get('/api/google/auth',
            this.googleAuth);
        app.get('/api/google/callback',
            this.googleCallback);
        app.get('/api/google/connect',
            isAuthenticated,
            this.googleConnect);
    }

    googleAuth(req, res) {
        console.log('GoogleController -> auth -> called');
        passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' })(req, res);
    }

    googleConnect(req, res) {
        console.log('GoogleController -> connect -> called');
        passport.authorize('google', { scope: 'https://www.googleapis.com/auth/plus.login' })(req, res);
    }

    googleCallback(req, res) {
        console.log('GoogleController -> connect callback -> called');
        passport.authorize('google', { scope: 'https://www.googleapis.com/auth/plus.login' }, (err, user) => {
            if (err) {
                console.log('GoogleController -> connect callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('GoogleController -> connect callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

}

module.exports = new GoogleController();