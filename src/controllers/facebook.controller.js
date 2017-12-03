
var passport = require('passport');
var generateAccessToken = require('../user/UserService').generateAccessToken;

module.exports = (app) => {
        app.get('/api/facebook/auth', (req, res) => {
            passport.authenticate('facebook-token', (err, user) => {
                if (err) {
                    console.log('FacebookController -> auth -> err');
                    return res.sendStatus(400);
                }
                if (!user) {
                    console.log('FacebookController -> auth -> no user');
                    return res.sendStatus(400);
                }
                var token = generateAccessToken(user.id);
                return res.json({
                    "auth": token
                });
        })(req, res);
    });
}