
var Users = require('../models/users');
class UserRepository {
    findOne(email, cb) {
        console.log('UserDao -> findOne() -> called');
        Users.find(email, function (err, results) {
            if (results.length == 1) {
                cb(err, results[0]);
            } else {
                cb(err, null);
            }
        });
    };

    activate(filters, cb) {
        console.log('UserDao -> activate() -> called');
        Users.findOne({ email: filters.email }, function (err, user) {
            if (err) {
                console.log('UserDao -> activate() -> err');
                return cb(err);
            }
            if (!user) {
                console.log('UserDao -> activate() -> user not found');
                return cb(null, false);
            }
            if (user.activationKey == null) {
                console.log('UserDao -> activate() -> account already activated');
                return cb(null, false);
            }
            if (filters.key != user.activationKey) {
                console.log('UserDao -> activate() -> incorrect activationKey');
                return cb(null, false);
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

    resendActivationEmail(filters, cb) {
        Users.findOne(filters.email, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (user.activationKey !== null) {
                mailService.sendVerficationEmail(user, cb);
            }
        });
    }

    sendForgotPasswordEmail(filters, cb) {
        Users.findOne(filters.email, function (err, user) {
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

    resetPassword(filters, cb) {
        Users.findOne(filters.email, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                console.log('UserDao -> resetPassword() -> user not found');
                return cb(null, false);
            }
            if (user.forgottenPasswordKey == null) {
                console.log('UserDao -> resetPassword() -> password reset not activated');
                return cb(null, false);
            }
            if (filters.key != user.forgottenPasswordKey) {
                console.log('UserDao -> resetPassword() -> incorrect forgottenPasswordKey');
                return cb(null, false);
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

    validPassword(user, password) {
        return bcrypt.compareSync(password, user.password);
    };
}
var generateRandomKey = function() {
    return crypto.randomBytes(64).toString('hex');
}

var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(90), null);
};

module.exports = new UserRepository();