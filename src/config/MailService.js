

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
        var message = {
            // sender info
            from: properties.email.USERNAME,
            // Comma separated list of recipients
            to: newUser.local.email,
            // Subject of the message
            subject: properties.email.verificationEmail.subject,
            // HTML body
            html: properties.email.verificationEmail.html
                                    .replace(/ACTIVATION-KEY/g, newUser.local.activationKey)
                                    .replace(/USER-EMAIL/g, newUser.local.email)
        };
        this.sendMessage(message, cb);
    }

    sendForgotPasswordEmail(user, cb) {
        var message = {
            // sender info
            from: properties.email.USERNAME,
            // Comma separated list of recipients
            to: user.local.email,
            // Subject of the message
            subject: properties.email.forgotPasswordEmail.subject,
            // HTML body
            html: properties.email.forgotPasswordEmail.html
                                    .replace(/FORGOT-PASSWORD-KEY/g, user.local.forgottenPasswordKey)
                                    .replace(/USER-EMAIL/g, user.local.email)
        };
        this.sendMessage(message, cb);
    }

    sendMessage(message, cb) {
        this.transport.sendMail(message, (err) => {
            if (err) {
                console.log('NodeMailerConfig -> sendMessage -> error');
                return cb(err);
            }
            console.log('NodeMailerConfig -> sendMessage -> success');
            return cb(null, true);
        });
    }
}

module.exports = new MailService();