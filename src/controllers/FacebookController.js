
var passport = require('passport');
var isAuthenticated = require('../user/UserService');

class FacebookController {
    createRoute(app) {
        app.get('/api/facebook/auth', this.facebookAuth);
        app.get('/api/facebook/auth/callback', this.facebookAuthCallback);
        app.get('/api/facebook/connect', isAuthenticated, this.facebookConnect);
        app.get('/api/facebook/connect/callback', this.facebookConnectCallback);
    }

    facebookAuth(req, res) {
        console.log('FacebookController -> auth -> called');
        passport.authenticate('facebook', (err, user) => {
            if (err) {
                console.log('FacebookController -> auth -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('FacebookController -> auth -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    facebookAuthCallback(req, res) {
        console.log('FacebookController -> auth callback -> called');
        passport.authenticate('facebook', (err, user) => {
            if (err) {
                console.log('FacebookController -> auth callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('FacebookController -> auth callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    facebookConnect(req, res) {
        console.log('FacebookController -> connect -> called');
        passport.authorize('facebook', (err, user) => {
            if (err) {
                console.log('FacebookController -> connect -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('FacebookController -> connect -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    facebookConnectCallback(req, res) {
        console.log('FacebookController -> connect callback -> called');
        passport.authorize('facebook', (err, user) => {
            if (err) {
                console.log('FacebookController -> connect callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('FacebookController -> connect callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }
}

module.exports = new FacebookController();