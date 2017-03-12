

var nodeMailer = require('nodemailer');
var properties;

var MailService = function (config) {
    if (config !== undefined) {
        properties = config;
    }
    if (properties === undefined) {
        console.log('MailService -> properties have not been configured');
        return;
    }
    this.transport = nodeMailer.createTransport(({
        service: 'gmail',
        auth: {
            user: properties.email.USERNAME,
            pass: properties.email.PASSWORD
        }
    }));
}

MailService.prototype.sendVerficationEmail = function (newUser, cb) {
    var domain = process.env.OPENSHIFT_APP_DNS || "localhost:4000";
    var message = {
        // sender info
        from: properties.email.USERNAME,
        // Comma separated list of recipients
        to: newUser.email,
        // Subject of the message
        subject: 'NotificationDashboard account verification',
        // HTML body
        html: "<p>Welcome to NotificationDashboard!</p> <br>" +
        "<p>Please click the following link to activate your account: </p>" +
        "<a href='https://" + domain + "/api/activate?key=" + newUser.activationKey +
        "&email=" + newUser.email + "'>activate account</a>"
    };
    this.sendMessage(message, function (error) {
        if (error) {
            console.log('PassportConfig -> local-register -> sendVerficationEmail -> error');
            return cb(null, false, {
                message: "Failed to send activation email"
            });
        }
        console.log('PassportConfig -> local-register -> sendVerficationEmail -> success');
        return cb(null, newUser);
    });
}

MailService.prototype.sendForgotPasswordEmail = function (user, cb) {
    var domain = process.env.OPENSHIFT_APP_DNS || "localhost:4000";
    var message = {
        // sender info
        from: properties.email.USERNAME,
        // Comma separated list of recipients
        to: user.email,
        // Subject of the message
        subject: 'NotificationDashboard password reset',
        // HTML body
        html: "<p>Please click the following link to reset your password: </p>" +
        "<a href='https://" + domain + "/api/resetPassword?key=" + user.forgottenPasswordKey +
        "&email=" + user.email + "'>reset password</a>"
    };
    this.sendMessage(message, function (error) {
        if (error) {
            console.log('PassportConfig -> local-register -> sendVerficationEmail -> error');
            return cb(null, false, {
                message: "Failed to send activation email"
            });
        }
        console.log('PassportConfig -> local-register -> sendVerficationEmail -> success');
        return cb(null, true);
    });
}

MailService.prototype.sendMessage = function (message, cb) {
    this.transport.sendMail(message, function (error) {
        if (error) {
            console.log('NodeMailerConfig -> sendMessage -> error');
            return cb(error);
        }
        console.log('NodeMailerConfig -> sendMessage -> success');
        return cb();
    });
}

module.exports = MailService;