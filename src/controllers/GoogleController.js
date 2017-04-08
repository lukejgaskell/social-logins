
var passport = require('passport');
var isAuthenticated = require('../user/UserService');

class GoogleController {
    createRoute(app) {
        app.get('/api/google/auth',
            this.googleAuth);
        app.get('/api/google/callback',
            this.googleAuthCallback);
        app.get('/api/google/connect',
            isAuthenticated,
            this.googleConnect);
        app.get('/api/google/connect/callback',
            this.googleConnectCallback);
    }

    googleAuth(req, res) {
        console.log('GoogleController -> auth -> called');
        passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }, (err, user) => {
            if (err) {
                console.log('GoogleController -> auth -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('GoogleController -> auth -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    googleAuthCallback(req, res) {
        console.log('GoogleController -> auth callback -> called');
        passport.authenticate('google', (err, user) => {
            if (err) {
                console.log('GoogleController -> auth callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('GoogleController -> auth callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    googleConnect(req, res) {
        console.log('GoogleController -> connect -> called');
        passport.authorize('google', { scope: 'https://www.googleapis.com/auth/plus.login' } , (err, user) => {
            if (err) {
                console.log('GoogleController -> connect -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('GoogleController -> connect -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    googleConnectCallback(req, res) {
        console.log('GoogleController -> connect callback -> called');
        passport.authorize('google', (err, user) => {
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