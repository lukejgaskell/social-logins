
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    local: {
        email               : String,
        password            : String,
        fullName            : String,
        activationKey       : String,
        forgottenPasswordKey: String
    },
    facebook: {
        id              : String,
        token           : String,
        displayName     : String
    },
    twitter: {
        id              : String,
        token           : String,
        displayName     : String
    },
    instagram: {
        id              : String,
        token           : String,
        displayName     : String
    },
    google: {
        id              : String,
        token           : String,
        displayName     : String,
    }
}, {
    timestamps: true
});

UserSchema.methods.generateRandomKey = function () {
    return crypto.randomBytes(64).toString('hex');
};

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(90), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema, 'users');