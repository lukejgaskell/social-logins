
var mongoose = require("mongoose");
var db = require("../config/DatabaseConfig.js");
var bcrypt = require('bcrypt-nodejs');
var mailService = require('../config/NodeMailerConfig');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    activationKey: {
        type: String
    },
    forgottenPasswordKey: {
        type: String,
        default: null
    },
    facebook: {
        id: {
            type: String
        },
        accessToken: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    twitter: {
        id: {
            type: String
        },
        accessToken: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    instagram: {
        id: {
            type: String
        },
        accessToken: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    google: {
        id: {
            type: String
        },
        accessToken: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    created: {
        type: Date,
        required: true,
        default: new Date()
    }
});


UserSchema.statics.findOne = function (email, cb) {
    console.log('UserDao -> findOne() -> called');
    this.find(email, function (err, results) {
        if (results.length == 1) {
            cb(err, results[0]);
        } else {
            cb(err, null);
        }
    });
};

UserSchema.statics.register = function (filters, cb) {
    console.log('UserDao -> register() -> called');
    User = this;
    this.findOne({ email: filters.email }, function (err, results) {
        if (results === null) {
            var newUser = new User();
            newUser.email = filters.email;
            newUser.password = generateHash(filters.password);
            newUser.fullName = filters.fullName;
            newUser.activationKey = generateRandomKey();
            newUser.save(function (err, doc) {
                if (err) {
                    return cb(err);
                }
                mailService.sendVerficationEmail(newUser, cb);
            });
        } else {
            return cb(err, null);
        }
    });
};

UserSchema.statics.activate = function (filters, cb) {
    console.log('UserDao -> activate() -> called');
    this.findOne({ email: filters.email }, function (err, user) {
        if (err) {
            console.log('UserDao -> activate() -> err');
            return cb(err);
        }
        if (!user) {
            console.log('UserDao -> activate() -> user not found');
            return cb(null, false, {
                message: 'User does not exist'
            });
        }
        if (user.activationKey == null) {
            console.log('UserDao -> activate() -> account already activated');
            return cb(null, false, {
                message: 'Your account is already activated'
            });
        }
        if (filters.key != user.activationKey) {
            console.log('UserDao -> activate() -> incorrect activationKey');
            return cb(null, false, {
                message: 'Failed to activate account'
            });
        }
        user.activationKey = null;
        user.save(function (err, doc) {
            if (err) {
                console.log('UserDao -> activate() -> err');
                return cb(err);
            }
            console.log('UserDao -> activate() -> success');
            return cb(null, user);
        });
    });
}

UserSchema.statics.resendActivationEmail = function (filters, cb) {
    this.findOne(filters.email, function (err, user) {
        if (err) {
            return cb(err);
        }
        if (user.activationKey !== null) {
            mailService.sendVerficationEmail(user, cb);
        }
    });
}

UserSchema.statics.sendForgotPasswordEmail = function (filters, cb) {
    this.findOne(filters.email, function (err, user) {
        if (err) {
            return cb(err);
        }
        user.forgottenPasswordKey = generateRandomKey();
        User.save(function (err, doc) {
            if (err) {
                return cb(err);
            }
            mailService.sendForgotPasswordEmail(newUser, cb);
        });
    });
}

UserSchema.statics.resetPassword = function (filters, cb) {
    this.findOne(filters.email, function (err, user) {
        if (err) {
            return cb(err);
        }
        if (!user) {
            console.log('UserDao -> resetPassword() -> user not found');
            return cb(null, false, {
                message: 'User does not exist'
            });
        }
        if (user.forgottenPasswordKey == null) {
            console.log('UserDao -> resetPassword() -> password reset not activated');
            return cb(null, false, {
                message: 'Password reset is not available'
            });
        }
        if (filters.key != user.forgottenPasswordKey) {
            console.log('UserDao -> resetPassword() -> incorrect forgottenPasswordKey');
            return cb(null, false, {
                message: 'Failed to reset password'
            });
        }
        user.forgottenPasswordKey = null;
        user.password = generateHash(filters.password);
        user.save(function (err, doc) {
            if (err) {
                console.log('UserDao -> resetPassword() -> err');
                return cb(err);
            }
            console.log('UserDao -> resetPassword() -> success');
            return cb(null, user);
        });
    });
}

UserSchema.statics.validPassword = function (user, password) {
    return bcrypt.compareSync(password, user.password);
};

UserSchema.statics.activateFacebook = function (user, accessToken, profile, done) {

    console.log('UserDao -> activateFacebook() -> called');
    user.facebook.id = profile.id;
    user.facebook.accessToken = accessToken;
    user.facebook.displayName = profile.displayName;
    
    user.save(function (err) {
        if (err) {
            console.log('UserDao -> activateFacebook() -> err');
            done(err);
        }

        console.log('UserDao -> activateFacebook() -> success');
        return done(null, user);
    });
}

UserSchema.statics.activateTwitter = function (user, accessToken, profile, done) {

    console.log('UserDao -> activateTwitter() -> called');
    console.log("profile: ", profile);
    user.twitter.id = profile.id;
    user.twitter.accessToken = accessToken;
    user.twitter.displayName = profile.displayName;

    user.save(function (err) {
        if (err) {
            console.log('UserDao -> activateTwitter() -> err');
            done(err);
        }

        console.log('UserDao -> activateTwitter() -> success');
        return done(null, user);
    });
}

UserSchema.statics.activateInstagram = function (user, accessToken, profile, done) {

    console.log('UserDao -> activateInstagram() -> called');
    user.instagram.id = profile.id;
    user.instagram.accessToken = accessToken;
    user.instagram.displayName = profile.displayName;

    user.save(function (err) {
        if (err) {
            console.log('UserDao -> activateInstagram() -> err');
            done(err);
        }

        console.log('UserDao -> activateInstagram() -> success');
        return done(null, user);
    });
}

UserSchema.statics.activateGoogle = function (user, accessToken, profile, done) {

    console.log('UserDao -> activateGoogle() -> called');
    user.google.id = profile.id;
    user.google.accessToken = accessToken;
    user.google.displayName = profile.displayName;

    user.save(function (err) {
        if (err) {
            console.log('UserDao -> activateGoogle() -> err');
            done(err);
        }

        console.log('UserDao -> activateGoogle() -> success');
        return done(null, user);
    });
}

UserSchema.statics.revokeAuth = function (user, params, done) {
    console.log('UserDao -> removeAuth() -> called');
    switch (params.revokeAuth) {
        case "facebook":
            user.facebook.accessToken = undefined;
            break;
        case "twitter":
            user.twitter.accessToken = undefined;
            break;
        case "instagram":
            user.instagram.accessToken = undefined;
            break;
        case "google":
            user.google.accessToken = undefined;
            break;
        default: break;
    }

    user.save(function (err) {
        if (err) {
            console.log('UserDao -> removeAuth() -> err');
            done(err, false, {
                message: "Failed to remove authorization for " + params.revokeAuth
            });
        }
        console.log('UserDao -> removeAuth() -> success');
        return done(null, user);
    });
}

var generateRandomKey = function () {
    return crypto.randomBytes(64).toString('hex');
}

var generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(90), null);
};

var user = mongoose.model('User', UserSchema);

module.exports = user;