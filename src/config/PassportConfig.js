
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
var UserProfiles = require('../models/user-profile.model');
var FacebookLogins = require('../models/facebook-login.model');
var passportJWT = require('passport-jwt');
var properties = require('./properties');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;



class PassportConfig {
    configure(app) {
        app.use(passport.initialize());
        console.log('its been intialized');
        passport.use('facebook-token', new FacebookTokenStrategy({
            clientID: properties.facebook.APP_ID,
            clientSecret: properties.facebook.APP_SECRET
        }, this.facebookLogin.bind(this)));
    }


    async facebookLogin(token, refreshToken, profile, cb) {
        console.log('PassportConfig -> facebookLogin -> called');
        try {
            var facebookLogin = await FacebookLogins.findOneAndUpdate({ id: profile.id }, {
                token: token
            });
            if (!facebookLogin) {
                var user = await UserProfiles.create({
                    email: profile.email,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    fullName: profile.displayName
                });
                var facebookLogin = await FacebookLogins.create({
                    profileId: user._id,
                    id: profile.id,
                    token: token,
                    refreshToken: refreshToken
                });
            }
        } catch (e) {
            console.log(e);
            return cb(e);
        }
        console.log(profile.displayName + ' successfully logged in via facebook');
        return cb(null, facebookLogin);
    }
}

module.exports = new PassportConfig();