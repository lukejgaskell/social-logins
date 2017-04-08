
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
      console.log("serializing user");
      return cb(null, user);
  }

  deserializeUser(user, cb) {
      console.log("deserializing user");
      Users.findOne(user, (err, user) => {
        return cb(err, user);
      });
  }
  
  localRegister(req, username, password, cb) {
        console.log('PassportConfig -> local-register -> called');
        process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'local.email' :  username }, (err, user) => {
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
                            if (err){
                              console.log('PassportConfig -> local-register -> !req.user -> save -> err');
                              return cb(err);
                            };
                            console.log('PassportConfig -> local-register -> !req.user -> save -> success');
                            return cb(null, newUser);
                        });
                    }
                });
            } else {
                console.log('PassportConfig -> local-register -> !req.user -> called');
                var user            = req.user;
                user.local.email    = username;
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
      Users.findOne({ 'local.email' :  username }, (err, user) => {
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

  facebookLogin(req, token, profile, cb) {
    console.log("facebook", profile);
        process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'facebook.id' : profile.id }, (err, user) => {
                    if (err) {
                      return cb(err);
                    }
                    if (user) {
                        return cb(null, user);
                    } else {
                        var newUser                   = new Users();
                        newUser.facebook.id           = profile.id;                 
                        newUser.facebook.token        = token;     
                        newUser.facebook.displayName  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email        = profile.emails[0].value;
                        newUser.save((err) => {
                            if (err) {
                              return cb(err);
                            }
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
                var user                  = req.user;
                user.facebook.id          = profile.id;
                user.facebook.token       = token;
                user.facebook.displayName = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email       = profile.emails[0].value;
                user.save((err) => {
                    if (err) {
                        return cb(err)
                    }
                    return cb(null, user);
                });
            }

        });
  }

  twitterLogin(req, token, profile, cb) {
    console.log("twitter", profile);
      process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'twitter.id' : profile.id }, (err, user) => {
                    if (err) {
                      return cb(err);
                    }
                    if (user) {
                        return cb(null, user);
                    } else {
                        var newUser                  = new Users();
                        newUser.twitter.id           = profile.id;                 
                        newUser.twitter.token        = token;     
                        newUser.twitter.displayName  = profile.displayName;
                        newUser.twitter.username     = profile.screen_name;
                        newUser.save((err) => {
                            if (err) {
                              return cb(err);
                            }
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
                var user                  = req.user;
                user.twitter.id           = profile.id;
                user.twitter.token        = token;
                user.twitter.displayName  = profile.displayName;
                user.twitter.username     = profile.screen_name;
                user.save((err) => {
                    if (err) {
                        return cb(err)
                    }
                    return cb(null, user);
                });
            }

        });
  }

  instagramLogin(req, token, profile, cb) {
    console.log("instagram", profile);
      process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'instagram.id' : profile.id }, (err, user) => {
                    if (err) {
                      return cb(err);
                    }
                    if (user) {
                        return cb(null, user);
                    } else {
                        var newUser                    = new Users();
                        newUser.instagram.id           = profile.id;                 
                        newUser.instagram.token        = token;     
                        newUser.instagram.displayName  = profile.displayName;
                        newUser.instagram.username     = profile.username;
                        newUser.save((err) => {
                            if (err) {
                              return cb(err);
                            }
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
                var user             = req.user;
                user.instagram.id    = profile.id;
                user.instagram.token = token;
                user.instagram.name  = profile.displayName;
                user.instagram.email = profile.username;
                user.save((err) => {
                    if (err) {
                        return cb(err)
                    }
                    return cb(null, user);
                });
            }

        });
  }

  googleLogin(req, token, profile, cb) {
      process.nextTick(() => {
            if (!req.user) {
                Users.findOne({ 'google.id' : profile.id }, (err, user) => {
                    if (err) {
                      return cb(err);
                    }
                    if (user) {
                        return cb(null, user);
                    } else {
                        var newUser                 = new Users();
                        newUser.google.id           = profile.id;                 
                        newUser.google.token        = token;     
                        newUser.google.displayName  = profile.name;
                        newUser.google.email        = profile.email;
                        newUser.save((err) => {
                            if (err) {
                              return cb(err);
                            }
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
                var user            = req.user;
                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.name;
                user.google.email = profile.email;
                user.save((err) => {
                    if (err) {
                        return cb(err)
                    }
                    return cb(null, user);
                });
            }

        });
  }
}

module.exports = new PassportConfig();