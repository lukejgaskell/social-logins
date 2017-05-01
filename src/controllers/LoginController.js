

var passport = require('passport');
var userRepository = require('../repositories/UserRepository');


class LoginController {
    createRoute(app) {
        app.get('/api/logOut', this.logOut);
        app.post('/api/login', this.login);
        app.post('/api/register', this.register);
        app.get('/api/activate', this.activate);
        app.post('/api/resendActivationEmail', this.resendActivationEmail);
        app.post('/api/sendForgotPasswordEmail', this.sendForgotPasswordEmail);
        app.get('/api/resetPassword', this.resetPassword);
    }

    logOut(req, res) {
        req.logOut();
        return res.sendStatus(200);
    }

    login(req, res) {
        console.log('LoginController -> login() -> called');
        passport.authenticate('local-login', (err, user) => {
            if (err) {
                console.log('LoginController -> login() -> err');
                console.log(err);
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('LoginController -> login() -> no user');
                return res.sendStatus(400);
            }
            console.log('LoginController -> login() -> success');
            return res.sendStatus(200);
        })(req, res);
    }
    

    register(req, res) {
        console.log('LoginController -> register() -> called');
        passport.authenticate('local-register', (err, user) => {
            if (err) {
                console.log('LoginController -> register() -> error');
                return res.sendStatus(500);
            }
            if (!user) {
                console.log('LoginController -> register() -> user not found');
                return res.sendStatus(400);
            }
            console.log('LoginController -> register() -> successfully registered');
            return res.send(user);
        })(req, res);
    }

    activate(req, res) {
        userRepository.activate(req.query, (err, user) => {
            if (err) {
                return res.sendStatus(500);
            }
            if (!user) {
                return res.sendStatus(400);
            }
            return res.send(user);
        });
    }

    resendActivationEmail(req, res) {
        userRepository.resendActivationEmail(req.body, function (err, success, info) {
            if (err) {
                return res.sendStatus(500);
            }
            if (!success) {
                return res.sendStatus(400);
            }
            return res.sendStatus(200);
        });
    }

    sendForgotPasswordEmail(req, res) {
        userRepository.sendForgotPasswordEmail(req.body, (err, success) => {
            if (err) {
                return res.sendStatus(500);
            }
            if (!success) {
                return res.sendStatus(400);
            }
            return res.sendStatus(200);
        });
    }

    resetPassword(req, res) {
        userRepository.resetPassword(req.body, function (err, user) {
            if (err) {
                return res.sendStatus(500);
            }
            if (!user) {
                return res.sendStatus(400);
            }
            return res.send(user);
        });
    }
   
}
module.exports = new LoginController();