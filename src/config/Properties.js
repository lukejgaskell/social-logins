
    var appUrl;
    var isProd = process.env.OPENSHIFT_APP_DNS !== undefined;
    if (isProd) {
        appUrl = "https://" + process.env.OPENSHIFT_APP_DNS + "/api";
    } else {
        appUrl = "http://localhost:8080/api";
    }
    var properties = {
        protocol: "http",
        domain: "localhost",
        port: 8080,

        // facebook
        facebook: {
            APP_ID: 2123391177888299,
            APP_SECRET: "7ba9062fb6cffa18fbe44a6cc15df413",
            CALLBACK_URL: appUrl + "/facebook/callback"
        },
        jwt: {
            secret: "Fawe46AFUu2eJEkgfzhBcBmYtuz9jJe7KTVPmWq&U]fskx/DUZLtDgHB^oxL7GzW"
        }

    };
    module.exports = properties;
