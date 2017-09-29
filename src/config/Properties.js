
var properties = {
    protocol: "http",
    domain: "localhost",
    port: 8000,
    database: {
        name: process.env.DB || 'accounts',
        user: process.env.DB_USER || 'admin',
        pass: process.env.DB_PASS || 'admin',
        url: 'mongo'
    },

    // facebook
    facebook: {
        APP_ID: 2123391177888299,
        APP_SECRET: "7ba9062fb6cffa18fbe44a6cc15df413",
        CALLBACK_URL: 'http://localhost:8000/api/facebook/callback'
    },
    jwt: {
        secret: "Fawe46AFUu2eJEkgfzhBcBmYtuz9jJe7KTVPmWq&U]fskx/DUZLtDgHB^oxL7GzW"
    }
};

module.exports = properties;
