
var isAuthenticated = require('../user/UserService.js').isAuthenticated;
var Users = require('../models/user-profile.model');

class UserController {
    createRoute(app) {
        app.get('/api/user', isAuthenticated, this.getUser);
    }
    
    getUser(req, res) {
        return res.json(req.user);
    }
}


module.exports = new UserController();