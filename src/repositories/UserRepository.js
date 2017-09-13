
var Users = require('../models/user-profile.model');
var FacebookLogins = require('../models/facebook-login.model');

class UserRepository {
    async getUserDetails(profileId) {
        try {
            var user = await Users.findById(profileId);
        } catch(e) {
            console.log('getUserDetailsError', e);
            return;
        }
        return user;
    }
    async getUserDetailsBySocialId(socialId) {

        try {
            var facebookLogin = await FacebookLogins.findOne({ id: socialId });
            var user = await Users.findById(facebookLogin.profileId);
        } catch(e) {
            console.log('getUserDetailsBySocialId', e);
            return;
        }
        return user;
    }
}

module.exports = new UserRepository();