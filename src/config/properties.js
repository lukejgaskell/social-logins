

var config = {};

config.protocol = process.env.PROTOCOL || "http";
config.domain = process.env.DOMAIN || "0.0.0.0";
config.host = process.env.HOST || "0.0.0.0"; //docker has to be 0.0.0.0
config.port = process.env.PORT || 8000;
config.database = {
    url: process.env.MONGO_URL || 'mongodb://mongo/accounts'
};
config.facebook = {
    APP_ID: 2123391177888299,
    APP_SECRET: "7ba9062fb6cffa18fbe44a6cc15df413",
    CALLBACK_URL: 'http://' + config.domain + ':' + config.port + '/api/facebook/callback'
};
config.jwt = {
    secret: "Fawe46AFUu2eJEkgfzhBcBmYtuz9jJe7KTVPmWq&U]fskx/DUZLtDgHB^oxL7GzW"
};

module.exports = config;