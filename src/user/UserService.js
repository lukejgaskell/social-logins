
var isAuthenticated = function (req, res, next) {
        console.log('auth: ' + req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        res.sendStatus(403);
    }

module.exports = isAuthenticated;