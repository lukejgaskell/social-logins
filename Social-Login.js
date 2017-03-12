
module.exports = function (app, properties, db) {

  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  var MailService = require("./src/config/MailService.js");
  var mailService = new MailService(properties);


  require("./src/config/SessionConfig.js")(app, properties, db);
  require("./src/config/PassportConfig.js")(app, properties);
  require("./src/routes.js")(app);
}