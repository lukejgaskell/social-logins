
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
            if (err) {
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
            Users.findOne({ 'local.email': username }, (err, user) => {
                if (err) {
                    console.log('PassportConfig -> local-register -> !req.user -> err');
                    return cb(err);
                }
                if (!req.user) {
                    if (user) {
                        console.log('PassportConfig -> local-register -> !req.user -> email in use');
                        return cb(null, false);
                    } else {
                        var newUser = new Users();
                        newUser.local.email = username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.activationKey = newUser.generateRandomKey();
                        newUser.local.fullName = req.body.fullName;
                        newUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> local-register -> !req.user -> save -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> local-register -> !req.user -> save -> success');
                            req.login(newUser, (err) => {
                                if (err) {
                                    return cb(err);
                                }
                                return mailService.sendVerficationEmail(newUser, cb);
                            });
                        });
                    }
                } else {
                    console.log('PassportConfig -> local-register -> !req.user -> called');
                    if (user) {
                        console.log('PassportConfig -> local-register -> req.user -> email in use');
                        return cb(null, false);
                    } else {
                        var currentUser = req.user;
                        currentUser.local.email = username;
                        currentUser.local.password = currentUser.generateHash(password);
                        currentUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> local-register -> req.user -> save -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> local-register -> req.user -> save -> success');
                            return mailService.sendVerficationEmail(currentUser, cb);
                        });
                    }
                }
            });
        });
    }

    localLogin(req, username, password, cb) {
        console.log('PassportConfig -> local-login -> called');
        Users.findOne({ 'local.email': username }, (err, user) => {
            if (err) {
                console.log('PassportConfig -> local-login -> err');
                return cb(err);
            }
            if (!user) {
                console.log('PassportConfig -> local-login -> user not found');
                return cb(null, false);
            }
            if (!user.validPassword(password)) {
                console.log('PassportConfig -> local-login -> invalid password');
                return cb(null, false);
            }
            if (user.local.activationKey !== null) {
                console.log('PassportConfig -> local-login -> account not activated');
                return cb(null, false);
            }
            if (user.local.forgottenPasswordKey !== null) {
                user.local.forgottenPasswordKey = null;
                user.save();
            }
            console.log('PassportConfig -> local-login -> success');
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
        this.doWork(req, 'facebook', profile, token, cb);
    }

    twitterLogin(req, token, refreshToken, profile, cb) {
        console.log('PassportConfig -> twitterLogin() -> called');
        this.doWork(req, 'twitter', profile, token, cb);
    }

    instagramLogin(req, token, refreshToken, profile, cb) {
        console.log('PassportConfig -> instagramLogin() -> called');
        this.doWork(req, 'instagram', profile, token, cb);
    }

    googleLogin(req, token, refreshToken, profile, cb) {
        console.log('PassportConfig -> googleLogin() -> called');
        this.doWork(req, 'google', profile, token, cb);
    }


    doWork(req, loginName, profile, token, cb) {
        process.nextTick(() => {
            Users.findOne().where(loginName + '.id', profile.id).exec((err, user) => {
                if (err) {
                    console.log('PassportConfig -> doWork() -> !req.user -> err');
                    return cb(err);
                }
                if (!req.user) {
                    if (user) {
                        req.login(user, (err) => {
                            if (err) {
                                console.log('PassportConfig -> doWork() -> !req.user -> user found -> login() -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> doWork() -> !req.user -> user found -> login() -> success');
                            return cb(null, user);
                        });
                    } else {
                        var newUser = new Users();
                        newUser[loginName].id = profile.id;
                        newUser[loginName].token = token;
                        newUser[loginName].displayName = profile.displayName;
                        newUser.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> doWork() -> !req.user -> save() -> err');
                                return cb(err);
                            }
                            req.login(newUser, (err) => {
                                if (err) {
                                    console.log('PassportConfig -> doWork() -> !req.user -> -> save() -> login() -> err');
                                    return cb(err);
                                }
                                console.log('PassportConfig -> doWork() -> !req.user -> save() -> login() -> err');
                                return cb(null, newUser);
                            });
                        });
                    }
                } else {
                    if (user) {
                        return cb(null, false);
                    } else {
                        var user = req.user;
                        user[loginName].id = profile.id;
                        user[loginName].token = token;
                        user[loginName].displayName = profile.displayName;
                        user.save((err) => {
                            if (err) {
                                console.log('PassportConfig -> doWork() -> req.user -> save() -> err');
                                return cb(err);
                            }
                            console.log('PassportConfig -> doWork() -> req.user -> save() -> success');
                            return cb(null, user);
                        });
                    }
                }
            });
        });
    }
}

module.exports = new PassportConfig();