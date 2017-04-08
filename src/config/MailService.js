

var nodeMailer = require('nodemailer');
var properties = require('./Properties').getProperties();

class MailService {
    constructor() {
        this.transport = nodeMailer.createTransport(({
            service: 'gmail',
            auth: {
                user: properties.email.USERNAME,
                pass: properties.email.PASSWORD
            }
        }));
    }

    sendVerficationEmail(newUser, cb) {
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
        this.sendMessage(message, (error) => {
            if (error) {
                console.log('PassportConfig -> local-register -> sendVerficationEmail -> error');
                return cb(null, false);
            }
            console.log('PassportConfig -> local-register -> sendVerficationEmail -> success');
            return cb(null, newUser);
        });
    }

    sendForgotPasswordEmail(user, cb) {
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
        this.sendMessage(message, (error) => {
            if (error) {
                console.log('PassportConfig -> local-register -> sendVerficationEmail -> error');
                return cb(null, false);
            }
            console.log('PassportConfig -> local-register -> sendVerficationEmail -> success');
            return cb(null, true);
        });
    }

    sendMessage(message, cb) {
        this.transport.sendMail(message, (error) => {
            if (error) {
                console.log('NodeMailerConfig -> sendMessage -> error');
                return cb(error);
            }
            console.log('NodeMailerConfig -> sendMessage -> success');
            return cb();
        });
    }
}

module.exports = new MailService();