
var mongoose = require('mongoose');

var FacebookLoginSchema = new mongoose.Schema({
    profileId       : String,
    id              : String,
    token           : String,
    refreshToken    : String
}, {
    timestamps: true
});

module.exports = mongoose.model('FacebookLogin', FacebookLoginSchema, 'FacebookLogins');