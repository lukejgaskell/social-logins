
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var UserDao = require('../database/UserDao');
var mailService = new require('../config/MailService')();

module.exports = function (app, properties) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    console.log("serializing user");
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    console.log("deserializing user");
    UserDao.findOne(user, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function (email, password, done) {
      console.log('PassportConfig -> local-login -> called');
      UserDao.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log('PassportConfig -> local-login -> error: ' + err);
          return done(err);
        }
        if (!user || !UserDao.validPassword(user, password)) {
          console.log('PassportConfig -> local-login -> invalid username or password');
          return done(null, false, {
            message: "Invalid username or password"
          });
        }
        if (user.activationKey != null) {
          console.log('PassportConfig -> local-login -> account not activated');
          return done(null, false, {
            message: "Account has not been activated"
          });
        }
        console.log('PassportConfig -> local-login -> login successful');
        return done(null, user);
      });
    }
  ));

  passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, email, password, done) {
      console.log('PassportConfig -> local-register -> called');
      UserDao.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log('PassportConfig -> local-register -> error: ' + err);
          return done(err);
        }
        if (user) {
          console.log('PassportConfig -> local-register -> username taken');
          return done(null, false, {
            message: "Email already in use"
          });
        }

        UserDao.register(req.body, done);
      });
    }
  ));

  passport.use('facebook', new FacebookStrategy({
    clientID: properties.facebook.APP_ID,
    clientSecret: properties.facebook.APP_SECRET,
    callbackURL: properties.facebook.CALLBACK_URL,
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      console.log('PassportConfig -> facebook-authorize -> called');
      process.nextTick(function () {
        UserDao.activateFacebook(req.user, accessToken, profile, done);
      });
    }
  ));

  passport.use('twitter', new TwitterStrategy({
    consumerKey: properties.twitter.APP_ID,
    consumerSecret: properties.twitter.APP_SECRET,
    callbackURL: properties.twitter.CALLBACK_URL,
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      console.log('PassportConfig -> twitter-authorize -> called');
      process.nextTick(function () {
        UserDao.activateTwitter(req.user, accessToken, profile, done);
      });
    }
  ));


  passport.use('instagram', new InstagramStrategy({
    clientID: properties.instagram.APP_ID,
    clientSecret: properties.instagram.APP_SECRET,
    callbackURL: properties.instagram.CALLBACK_URL,
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      console.log('PassportConfig -> twitter-authorize -> called');
      process.nextTick(function () {
        UserDao.activateInstagram(req.user, accessToken, profile, done);
      });
    }
  ));

  passport.use('google', new GoogleStrategy({
    clientID: properties.google.APP_ID,
    clientSecret: properties.google.APP_SECRET,
    callbackURL: properties.google.CALLBACK_URL,
    passReqToCallback: true
  },
    function (req, accessToken, refreshToken, profile, done) {
      console.log('PassportConfig -> google-authorize -> called');
      process.nextTick(function () {
        UserDao.activateGoogle(req.user, accessToken, profile, done);
      });
    }
  ));
}