
var isAuthenticated = require('./UserService.js');
var UserDao = require('../database/UserDao');

module.exports = function (app) {

    
    app.get("/api/user", isAuthenticated, function (req, res) {
        res.json({ fullName: req.user.fullName,
                    facebookAuth: req.user.facebook.accessToken !== undefined,
                    twitterAuth: req.user.twitter.accessToken !== undefined,
                    instagramAuth: req.user.instagram.accessToken !== undefined,
                    googleAuth: req.user.google.accessToken !== undefined
                });
    });

    app.post("/api/user/revokeAuth", isAuthenticated, function (req, res) {
        UserDao.revokeAuth(req.user, req.body, function (err, user, info) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send(info);
            }
            res.sendStatus(200);
        });
    });
}