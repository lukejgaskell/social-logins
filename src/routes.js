
var fs = require('fs');
var path = require('path');

class Routes {
    createRoutes(app) {

        var controllers = this.readDirectory('./src');

        controllers.forEach(controllerFile => {
            var controller = require('../' + controllerFile);
            controller.createRoute(app);
        });
    }

    readDirectory(dir) {
        return fs.readdirSync(dir)
            .reduce((files, file) =>
                fs.statSync(path.join(dir, file)).isDirectory() ?
                    files.concat(this.readDirectory(path.join(dir, file))) :
                    files.concat(path.join(dir, file)),
            []).filter(file => file.includes('.controller'));
    }
}

module.exports = new Routes();