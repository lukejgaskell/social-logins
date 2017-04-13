

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var properties = require('./Properties').getProperties();

class SessionConfig {
    configure(app, db) {
        session.Session.prototype.login = this.login;
        app.use(this.sessionConfig(db));
    }
    
    login(user, cb) {
        const req = this.req;
        var temp = req.session.passport;
        req.session.regenerate(function (err) {
            if (err) {
                return cb(err);
            }
            req.session.passport = temp;
            req.session.save(function (err) {
                if (err) {
                    return cb(err);
                }
                return cb(null, user);
            });
        });
    }

    sessionConfig(db) {
        return session({
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
            name: 'id'
        });
    }
}

module.exports = new SessionConfig();