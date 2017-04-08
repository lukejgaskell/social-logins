
var passport = require('passport');
var isAuthenticated = require('../user/UserService');


class InstagramController {
    createRoute(app) {
        app.get('/api/instagram/auth',
            this.instagramAuth);
        app.get('/api/instagram/callback',
            this.instagramAuthCallback);
        app.get('/api/instagram/connect',
            isAuthenticated,
            this.instagramConnect);
        app.get('/api/instagram/connect/callback',
            this.instagramConnectCallback);
    }

    instagramAuth(req, res) {
         console.log('InstagramController -> auth -> called');
         passport.authenticate('instagram', (err, user) => {
            if (err) {
                console.log('InstagramController -> auth -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('InstagramController -> auth -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    instagramAuthCallback(req, res) {
            console.log('InstagramController -> auth callback -> called');
            passport.authenticate('instagram', (err, user) => {
            if (err) {
                console.log('InstagramController -> auth callback -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('InstagramController -> auth callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    instagramConnect(req, res) {
         console.log('InstagramController -> connect -> called');
         passport.authorize('instagram', (err, user) => {
            if (err) {
                console.log('InstagramController -> connect -> err');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('InstagramController -> connect -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }

    instagramConnectCallback(req, res) {
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