
var isAuthenticated = require('../user/UserService.js').isAuthenticated;
var Users = require('../models/user-profile.model');

module.exports = (app) => {
    app.get('/api/user', isAuthenticated, (req, res) => {
        return res.json(req.user);
    });
}