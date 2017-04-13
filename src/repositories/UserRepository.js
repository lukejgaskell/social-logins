
var Users = require('../models/users');
var mailService = require('../config/MailService');
class UserRepository {

    activate(filters, cb) {
        console.log('UserDao -> activate() -> called');
        Users.findOne({ 'local.email': filters.email }, (err, user) => {
            if (err) {
                console.log('UserDao -> activate() -> err');
                return cb(err);
            }
            if (!user) {
                console.log('UserDao -> activate() -> user not found');
                return cb(null, false);
            }
            if (user.local.activationKey == null) {
                console.log('UserDao -> activate() -> account already activated');
                return cb(null, false);
            }
            if (filters.key != user.local.activationKey) {
                console.log('UserDao -> activate() -> incorrect activationKey');
                return cb(null, false);
            }
            user.local.activationKey = null;
            user.save((err, doc) => {
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
        Users.findOne({ 'local.email': filters.email }, (err, user) => {
            if (err) {
                return cb(err);
            }
            if (user.local.activationKey !== null) {
                mailService.sendVerficationEmail(user, cb);
            }
        });
    }

    sendForgotPasswordEmail(filters, cb) {
        Users.findOne({ 'local.email': filters.email }, (err, user) => {
            if (err) {
                return cb(err);
            }
            user.local.forgottenPasswordKey = user.generateRandomKey();
            user.save(function (err, doc) {
                if (err) {
                    return cb(err);
                }
                mailService.sendForgotPasswordEmail(user, cb);
            });
        });
    }

    resetPassword(filters, cb) {
        Users.findOne({ 'local.email': filters.email }, (err, user) => {
            if (err) {
                return cb(err);
            }
            if (!user) {
                console.log('UserRepository -> resetPassword() -> user not found');
                return cb(null, false);
            }
            if (user.local.forgottenPasswordKey == null) {
                console.log('UserRepository -> resetPassword() -> password reset not activated');
                return cb(null, false);
            }
            if (filters.key != user.local.forgottenPasswordKey) {
                console.log('UserRepository -> resetPassword() -> incorrect forgottenPasswordKey');
                return cb(null, false);
            }
            user.local.forgottenPasswordKey = null;
            user.local.password = user.generateHash(filters.password);
            user.save(function (err, doc) {
                if (err) {
                    console.log('UserRepository -> resetPassword() -> err');
                    return cb(err);
                }
                console.log('UserRepository -> resetPassword() -> success');
                return cb(null, user);
            });
        });
    }
}

module.exports = new UserRepository();