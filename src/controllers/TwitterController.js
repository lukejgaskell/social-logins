
var passport = require('passport');
var isAuthenticated = require('../user/UserService');

class TwitterController {
    createRoute(app) {
        app.get('/api/twitter/auth', passport.authenticate('twitter'), this.twitterAuth);
        app.get('/api/twitter/auth/callback', passport.authenticate('twitter'), this.twitterAuthCallback);
        app.get('/api/twitter/connect', isAuthenticated, passport.authorize('twitter'), this.twitterConnect);
        app.get('/api/twitter/connect/callback', passport.authorize('twitter'), this.twitterConnectCallback);
    }

    twitterAuth(req, res) {
        console.log('TwitterController -> auth -> called');
         passport.authorize('twitter', (err, user) => {
            if (err) {
                console.log('TwitterController -> auth -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('TwitterController -> auth -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    twitterAuthCallback(req, res) {
        console.log('TwitterController -> auth callback -> called');
        passport.authenticate('twitter', (err, user) => {
            if (err) {
                console.log('TwitterController -> auth callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('TwitterController -> auth callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    twitterConnect(req, res) {
        console.log('TwitterController -> connect -> called');
        passport.authorize('twitter', (err, user) => {
            if (err) {
                console.log('TwitterController -> connect -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('TwitterController -> connect -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    twitterConnectCallback(req, res) {
        console.log('TwitterController -> connect callback -> called');
        passport.authorize('twitter', (err, user) => {
            if (err) {
                console.log('TwitterController -> connect callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('TwitterController -> connect callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }
}

module.exports = new TwitterController();