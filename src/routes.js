

module.exports = function(app) {
    require("./login/LoginController.js")(app);
    require("./user/UserController.js")(app);
    require("./integrations/FacebookController.js")(app);
    require("./integrations/TwitterController.js")(app);
    require("./integrations/InstagramController.js")(app);
    require("./integrations/GoogleController.js")(app);
}