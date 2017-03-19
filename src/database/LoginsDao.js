

var mongoose = require("mongoose");

const LoginsSchema = new mongoose.Schema({
    identityKey: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    failedAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    timeout: {
        type: Date,
        required: true,
        default: new Date()
    },
    inProgress: {
        type: Boolean
    }
});

LoginsSchema.static("canAuthenticate", function (key) {
    console.log('LoginsDao -> canAuthenticate() -> called');
    const login = this.findOne({ identityKey: key }, function (err, data) {
        if (err) {
            return err;
        }
        return data;
    });
    if (!login || login.failedAttempts < 5) {
        return true;
    }

    const timeout = (new Date() - new Date(login.timeout()).addMinutes(1));

    if (timeout >= 0) {
        login.remove();
        return true;
    }
    return next();
});

LoginsSchema.static("failedLoginAttempt", function (key) {
    console.log('LoginsDao -> failedLoginAttempt() -> called');
    const query = { identityKey: key };
    const update = { $inc: { failedAttempts: 1 }, timeout: new Date() };
    const options = { setDefaultOnInsert: true, upsert: true };
    return this.findOneAndUpdate(query, update, options, function (err, data) {
        if (err) {
            return err;
        }
        return data;
    }).exec();
});

LoginsSchema.static("successfulLoginAttempt", function (key) {
    console.log('LoginsDao -> successfulLoginAttempt() -> called');
    const login = this.findOne({ identityKey: key }, function (err, data) {
        if (err) {
            return err;
        }
        return data;
    });
    console.log("login: " + login);
    if (login) {
        return login.remove();
    }
});

module.exports = mongoose.model('LoginsDao', LoginsSchema);