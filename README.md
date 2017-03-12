# Social-Login
'
var properties = {
        // session properties
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
            PASSWORD: 'hx(iuTiW8$GG7=zy3bjz'
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
'