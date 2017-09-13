
var mongoose = require('mongoose');

var UserProfileSchema = new mongoose.Schema({
    email           : String,
    firstName       : String,
    lastName        : String,
    fullName        : String
}, {
    timestamps: true
});

module.exports = mongoose.model('UserProfile', UserProfileSchema, 'UserProfiles');