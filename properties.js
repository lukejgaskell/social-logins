
    var appUrl;
    var isProd = process.env.OPENSHIFT_APP_DNS !== undefined;
    if (isProd) {
        appUrl = "https://" + process.env.OPENSHIFT_APP_DNS + "/api";
    } else {
        appUrl = "http://localhost:4000/api";
    }
    var properties = {
        // session properties
        protocol: "http",
        domain: "localhost",
        port: 4000,
        session: {
            SECRET: "YqcPmjUVLx.YJo^7HJdT3j4HvHopw^",
            DB_EXPIRE: 14 * 24 * 60 * 60,
            EXPIRE: 4 * 60 * 60 * 1000,
            SECURE: isProd,
            PROXY: isProd
        },

        // email
        email: {
            USERNAME: 'notificationdashboard@gmail.com',
            PASSWORD: 'hx(iuTiW8$GG7=zy3bjz',
            verificationEmail: {
                subject: "Welcome to the app!",
                html: "<div>click and stuff for stuff</div>"
            },
            forgotPasswordEmail: {
                subject: "Guess you forgot your password!",
                html: "<div>sucks to suck</div>"
            }
        },
        // facebook
        facebook: {
            APP_ID: 326680404375212,
            APP_SECRET: "94dcd6776851c2d497eb01911ea353c8",
            CALLBACK_URL: appUrl + "/facebook/callback"
        },

        twitter: {
            APP_ID: "RClSygJoHyzEWj7NZloS9WjZC",
            APP_SECRET: "dGiG49ZJx7cJp6TGjcn2rswlrhEAFwD4ywoHRzOjeLrnJXPGfi",
            CALLBACK_URL: appUrl + "/twitter/callback"
        },

        instagram: {
            APP_ID: "4ba35cba98c94de98f631e44a71ab555",
            APP_SECRET: "2d3cf740801e441598a5b0d78b430a7a",
            CALLBACK_URL: appUrl + "/instagram/callback"
        },

        google: {
            APP_ID: "307471399050-sitajpd4uimvaf5ef5b6ieu71vftch7f.apps.googleusercontent.com",
            APP_SECRET: "rja0-2wUPSDDB1QpFQWapys2",
            CALLBACK_URL: appUrl + "/google/callback"
        }

    };
    module.exports = properties;
