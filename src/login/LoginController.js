

var passport = require('passport');
var UserDao = require('../models/user');
var LoginsDao = require('../models/login');

module.exports = function (app) {

    app.get('/api/logOut', function (req, res, next) {
        req.logOut();
        res.sendStatus(200);
    });

    app.post('/api/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                console.log('LoginController -> login() -> err');
                return res.status(500).send(err);
            }
            if (!user) {
                console.log('LoginController -> login() -> no user');
                //const identityKey = "${req.email}-{req.ip}"
                return res.status(400).send(info);
            }
            req.login(user, function (err) {
                if (err) {
                    console.log('LoginController -> login() -> req.login() -> err');
                    return next(err);
                }

                var temp = req.session.passport;
                req.session.regenerate(function (err) {
                    if (err) {
                        console.log('LoginController -> login() -> req.session.regenerate() -> err');
                        return next(err);
                    }
                    req.session.passport = temp;
                    req.session.save(function (err) {
                        if (err) {
                            console.log('LoginController -> login() -> req.session.save() -> err');
                            return next(err);
                        }
                        res.sendStatus(200);
                    });
                });
            });
        })(req, res, next)
    });

    app.post('/api/register', function (req, res, next) {
        passport.authenticate('local-register', function (err, user, info) {
            console.log('LoginController -> register() -> called');
            if (err) {
                console.log('LoginController -> register() -> error');
                return res.status(500).send(err);
            }
            if (!user) {
                console.log('LoginController -> register() -> error');
                return res.status(400).send(info);
            }
            req.login(user, function (err) {
                if (err) {
                    console.log('LoginController -> register() -> req.login() -> err');
                    return next(err);
                }

                var temp = req.session.passport;
                req.session.regenerate(function (err) {
                    if (err) {
                        console.log('LoginController -> register() -> req.session.regenerate() -> err');
                        return next(err);
                    }
                    req.session.passport = temp;
                    req.session.save(function (err) {
                        if (err) {
                            console.log('LoginController -> register() -> req.session.save() -> err');
                            return next(err);
                        }
                        res.sendStatus(200);
                    });
                });
            });
        })(req, res, next)
    });

    app.get('/api/activate', function (req, res) {
        UserDao.activate(req.query, function (err, user, info) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send(info);
            }
            return res.redirect('/dashboard');
        });
    });

    app.post('/api/resendActivationEmail', function (req, res) {

        UserDao.resendActivationEmail(req.body, function (err, success, info) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!success) {
                return res.status(400).send(info);
            }
            return res.sendStatus(200);
        });
    });

    app.post('/api/sendForgotPasswordEmail', function (req, res) {
        UserDao.sendForgotPasswordEmail(req.body, function (err, success, info) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!success) {
                return res.status(400).send(info);
            }
            return res.sendStatus(200);
        });
    });

    app.get('/api/resetPassword', function (req, res) {
        UserDao.resetPassword(req.body, function (err, user, info) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(400).send(info);
            }
            req.login(user, function (err) {
                if (err) { return res.status(500).send(err); }

                var temp = req.session.passport;
                req.session.regenerate(function (err) {
                    if (err) {
                        console.log('LoginController -> register() -> req.session.regenerate() -> err');
                        return next(err);
                    }
                    req.session.passport = temp;
                    req.session.save(function (err) {
                        if (err) {
                            console.log('LoginController -> register() -> req.session.save() -> err');
                            return next(err);
                        }
                        res.redirect('/dashboard');
                    });
                });
            });
        });
    });
}