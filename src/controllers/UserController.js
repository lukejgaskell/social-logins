
var isAuthenticated = require('../user/UserService.js');
var Users = require('../models/users');

class UserController {
    createRoute(app) {
        app.get("/api/user", isAuthenticated, this.getUser);
        app.post("/api/user/revokeAuth", isAuthenticated, this.revokeAuth);
    }

    getUser(req, res) {
       return res.json({ fullName: req.user.fullName,
                    facebookAuth: req.user.facebook.accessToken !== undefined,
                    twitterAuth: req.user.twitter.accessToken !== undefined,
                    instagramAuth: req.user.instagram.accessToken !== undefined,
                    googleAuth: req.user.google.accessToken !== undefined
                });
    }

    revokeAuth(req, res) {
        Users.revokeAuth(req.user, req.body, function (err, user, info) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send(info);
            }
            res.sendStatus(200);
        });
    }
}


module.exports = new UserController();