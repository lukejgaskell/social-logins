
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Users = require('../models/users');
var mailService = require('./MailService');
var properties = require('./Properties').getProperties();

class PassportConfig {
    configure(app) {
        app.use(passport.initialize());
        app.use(passport.session());
        passport.serializeUser(this.serializeUser);
        passport.deserializeUser(this.deserializeUser);
        passport.use('local-login', new LocalStrategy({
            passReqToCallback: true
        }, this.localLogin.bind(this)));

        passport.use('local-register', new LocalStrategy({
            passReqToCallback: true
        }, this.localRegister.bind(this)));

        passport.use('facebook', new FacebookStrategy({
            clientID: properties.facebook.APP_ID,
            clientSecret: properties.facebook.APP_SECRET,
            callbackURL: properties.facebook.CALLBACK_URL,
            passReqToCallback: true
        }, this.facebookLogin.bind(this)));

        passport.use('twitter', new TwitterStrategy({
            consumerKey: properties.twitter.APP_ID,
            consumerSecret: properties.twitter.APP_SECRET,
            callbackURL: properties.twitter.CALLBACK_URL,
            passReqToCallback: true
        }, this.twitterLogin.bind(this)));

        passport.use('instagram', new InstagramStrategy({
            clientID: properties.instagram.APP_ID,
            clientSecret: properties.instagram.APP_SECRET,
            callbackURL: properties.instagram.CALLBACK_URL,
            passReqToCallback: true
        }, this.instagramLogin.bind(this)));

        passport.use('google', new GoogleStrategy({
            clientID: properties.google.APP_ID,
            clientSecret: properties.google.APP_SECRET,
            callbackURL: properties.google.CALLBACK_URL,
            passReqToCallback: true
        }, this.googleLogin.bind(this)));

    }

    serializeUser(user, cb) {
        return cb(null, user.id);
    }

    deserializeUser(id, cb) {
        Users.findById(id, (err, foundUser) => {
            if(err) {
                return cb(err);
            }
            if (!foundUser) {
                console.log('user was not found!');
            }
            return cb(null, foundUser);
        });
    }

    localRegister(req, username, password, cb) {
        console.log('PassportConfig -> local-register -> called');
        process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'local.email': username }, (err, user) => {
                    if (err) {
                        console.log('PassportConfig -> local-register -> !req.user -> err');
                        return cb(err);
                    }
                    if (user) {
                        console.log('PassportConfig -> local-register -> !req.user -> email in use');
                        return cb(null, false);
                    } else {
                        var newUser = new Users();
                        newUser.local.email = username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> local-register -> !req.user -> save -> err');
                                return cb(err);
                            };
                            console.log('PassportConfig -> local-register -> !req.user -> save -> success');
                            req.login(newUser, (err) => {
                                if (err) {
                                    return cb(err);
                                }
                                return cb(null, newUser);
                            });
                        });
                    }
                });
            } else {
                console.log('PassportConfig -> local-register -> !req.user -> called');
                var user = req.user;
                user.local.email = username;
                user.local.password = user.generateHash(password);
                user.save((err) => {
                    if (err) {
                        console.log('PassportConfig -> local-register -> req.user -> save -> err');
                        return cb(err);
                    }
                    console.log('PassportConfig -> local-register -> req.user -> save -> success');
                    return cb(null, user);
                });
            }
        });
    }

    localLogin(req, username, password, cb) {
        console.log("PassportConfig -> local-login -> called");
        Users.findOne({ 'local.email': username }, (err, user) => {
            if (err) {
                console.log("PassportConfig -> local-login -> err");
                return cb(err);
            }
            if (!user) {
                console.log("PassportConfig -> local-login -> user not found");
                return cb(null, false);
            }
            if (!user.validPassword(password)) {
                console.log("PassportConfig -> local-login -> invalid password");
                return cb(null, false);
            }
            console.log("PassportConfig -> local-login -> success");
            req.login(user, (err) => {
                if (err) {
                    return cb(err);
                }
                return cb(null, user);
            });
        });
    }

    facebookLogin(req, token, refreshToken, profile, cb) {
        console.log('PassportConfig -> facebookLogin() -> called');
        process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'facebook.id': profile.id }, (err, user) => {
                    if (err) {
                        console.log('PassportConfig -> facebookLogin() -> !req.user -> err');
                        return cb(err);
                    }
                    if (user) {
                        console.log('PassportConfig -> facebookLogin() -> !req.user -> user found');
                        req.login(user, (err) => {
                            if (err) {
                                console.log('PassportConfig -> facebookLogin() -> !req.user -> login() -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> facebookLogin() -> !req.user -> login() -> success');
                            return cb(null, user);
                        });
                    } else {
                        var newUser = new Users();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.displayName = profile.displayName;
                        newUser.facebook.email = profile.email;
                        newUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> facebookLogin() -> !req.user -> save() -> err');
                                return cb(err);
                            }
                            req.login(newUser, (err) => {
                                if (err) {
                                    console.log('PassportConfig -> facebookLogin() -> !req.user -> save() -> login() -> err');
                                    return cb(err);
                                }
                                console.log('PassportConfig -> facebookLogin() -> !req.user -> save() -> login() -> success');
                                return cb(null, newUser);
                            });
                        });
                    }
                });
            } else {
                var user = req.user;
                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.displayName = profile.displayName;
                user.save((err) => {
                    if (err) {
                        return cb(err)
                    }
                    return cb(null, user);
                });
            }

        });
    }

    twitterLogin(req, token, refreshToken, profile, cb) {
        console.log('PassportConfig -> twitterLogin() -> called');
        process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'twitter.id': profile.id }, (err, user) => {
                    if (err) {
                        console.log('PassportConfig -> twitterLogin() -> !req.user -> err');
                        return cb(err);
                    }
                    if (user) {
                        console.log('PassportConfig -> twitterLogin() -> !req.user -> user exists');
                        req.login(user, (err) => {
                            if (err) {
                                console.log('PassportConfig -> twitterLogin() -> !req.user -> login() -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> twitterLogin() -> !req.user -> login() -> success');
                            return cb(null, user);
                        });
                    } else {
                        var newUser = new Users();
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.displayName = profile.displayName;
                        newUser.twitter.username = profile.username;
                        newUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> twitterLogin() -> !req.user -> save -> err');
                                return cb(err);
                            }
                            req.login(newUser, (err) => {
                                if (err) {
                                    console.log('PassportConfig -> twitterLogin() -> !req.user -> save -> err');
                                    return cb(err);
                                }
                                return cb(null, newUser);
                            });
                        });
                    }
                });
            } else {
                var user = req.user;
                user.twitter.id = profile.id;
                user.twitter.token = token;
                user.twitter.displayName = profile.displayName;
                user.twitter.username = profile.screen_name;
                user.save((err) => {
                    if (err) {
                        return cb(err)
                    }
                    return cb(null, user);
                });
            }

        });
    }

    instagramLogin(req, token, refreshToken, profile, cb) {
        console.log('PassportConfig -> instgramLogin() -> called');
        process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'instagram.id': profile.id }, (err, user) => {
                    if (err) {
                        console.log('PassportConfig -> instgramLogin() -> !req.user -> err');
                        return cb(err);
                    }
                    if (user) {
                        req.login(user, (err) => {
                            if (err) {
                                console.log('PassportConfig -> instagramLogin() -> !req.user -> user found -> login() -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> instagramLogin() -> !req.user -> user found -> login() -> success');
                            return cb(null, user);
                        });
                    } else {
                        var newUser = new Users();
                        newUser.instagram.id = profile.id;
                        newUser.instagram.token = token;
                        newUser.instagram.displayName = profile.displayName;
                        newUser.instagram.username = profile.username;
                        newUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> instgramLogin() -> !req.user -> save() -> err');
                                return cb(err);
                            }
                            req.login(newUser, (err) => {
                                if (err) {
                                    console.log('PassportConfig -> instgramLogin() -> !req.user -> -> save() -> login() -> err');
                                    return cb(err);
                                }
                                console.log('PassportConfig -> instgramLogin() -> !req.user -> save() -> login() -> err');
                                return cb(null, newUser);
                            });
                        });
                    }
                });
            } else {
                var user = req.user;
                user.instagram.id = profile.id;
                user.instagram.token = token;
                user.instagram.displayName = profile.displayName;
                user.instagram.username = profile.username;
                user.save((err) => {
                    if (err) {
                        console.log('PassportConfig -> instgramLogin() -> req.user -> save() -> err');
                        return cb(err)
                    }
                    console.log('PassportConfig -> instgramLogin() -> req.user -> save() -> success');
                    return cb(null, user);
                });
            }

        });
    }

    googleLogin(req, token, refreshToken, profile, cb) {
        process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'google.id': profile.id }, (err, user) => {
                    if (err) {
                        return cb(err);
                    }
                    if (user) {
                        req.login(user, (err) => {
                            if (err) {
                                console.log('PassportConfig -> googleLogin() -> !req.user -> login() -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> googleLogin() -> !req.user -> login() -> success');
                            return cb(null, user);
                        });
                    } else {
                        var newUser = new Users();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.displayName = profile.displayName;
                        newUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> googleLogin() -> !req.user -> save() -> err');
                                return cb(err);
                            }
                            req.login(newUser, (err) => {
                                if (err) {
                                    console.log('PassportConfig -> googleLogin() -> !req.user -> save() -> login() -> err');
                                    return cb(err);
                                }
                                console.log('PassportConfig -> googleLogin() -> req.user -> save() -> login() -> success');
                                return cb(null, newUser);
                            });
                        });
                    }
                });
            } else {
                console.log('PassportConfig -> googleLogin() -> req.user');
                req.user.google.id = profile.id;
                req.user.google.token = token;
                req.user.google.displayName = profile.displayName;
                var user = req.user;
                user.save((err) => {
                    if (err) {
                        console.log('PassportConfig -> googleLogin() -> req.user -> save() -> err');
                        return cb(err)
                    }
                    console.log('PassportConfig -> googleLogin() -> req.user -> save() -> success');
                    return cb(null, user);
                });
            }

        });
    }
}

module.exports = new PassportConfig();