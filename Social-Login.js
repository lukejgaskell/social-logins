

class SocialLogin {
    init(app, properties, db, mongoose) {

        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var Properties = require("./src/config/Properties");
        Properties.setProperties(properties);

        var SessionConfig = require("./src/config/SessionConfig.js");
        SessionConfig.configure(app, db);

        var passportConfig = require("./src/config/PassportConfig");
        passportConfig.configure(app);

        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        var routes = require("./src/routes");
        routes.createRoutes(app);

        this.models = {
            User: mongoose.model("User")
        }
    }
}

module.exports = new SocialLogin();