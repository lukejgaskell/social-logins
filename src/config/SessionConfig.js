

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

module.exports = function SessionConfig(app, properties, db) {

    session.Session.prototype.login = function (user, cb) {
        const req = this.req;
        req.session.regenerate(function (err) {
            if (err) {
                cb(err);
            }
        });
        req.session.userInfo = user;
        cb();
    };

    app.use(session({
        store: new MongoStore({
            mongooseConnection: db,
            ttl: properties.session.DB_EXPIRE
        }),
        secret: properties.session.SECRET,
        resave: false,
        saveUninitialized: true,
        proxy: properties.session.PROXY,
        cookie: {
            secure: properties.session.SECURE,
            httpOnly: true,
            maxAge: properties.session.EXPIRE
        },
        name: "id"
    }));

}