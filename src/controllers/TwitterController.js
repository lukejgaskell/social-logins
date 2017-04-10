
var passport = require('passport');
var isAuthenticated = require('../user/UserService');

class TwitterController {
    createRoute(app) {
        app.get('/api/twitter/auth', passport.authenticate('twitter'), this.twitterAuth);
        app.get('/api/twitter/callback', passport.authenticate('twitter'), this.twitterCallback);
        app.get('/api/twitter/connect', isAuthenticated, passport.authorize('twitter'), this.twitterConnect);
    }

    twitterAuth(req, res) {
        console.log('TwitterController -> auth -> called');
         passport.authenticate('twitter')(req, res);
    }

    twitterConnect(req, res) {
        console.log('TwitterController -> connect -> called');
        passport.authorize('twitter')(req, res);
    }

    twitterCallback(req, res) {
        console.log('TwitterController -> callback -> called');
        passport.authorize('twitter', (err, user) => {
            if (err) {
                console.log('TwitterController -> callback -> err');
                console.log(err);
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('TwitterController -> callback -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.sendStatus(400);
            }
            return res.send(user);
        })(req, res);
    }
}

module.exports = new TwitterController();