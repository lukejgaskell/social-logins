
var passport = require('passport');
var generateAccessToken = require('../user/UserService').generateAccessToken;

module.exports = (app) => {
        app.get('/api/facebook/auth', (req, res) => {
            console.log('FacebookController -> auth -> called');
            passport.authenticate('facebook')(req, res);
        });
        app.get('/api/facebook/callback', async (req, res) => {
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
        });

}