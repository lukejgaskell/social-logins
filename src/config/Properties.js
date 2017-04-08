


class Properties {
    setProperties(config) {
        this.properties = config;
    }

    getProperties() {
        if(this.properties === undefined) {
            console.log("getProperties called without being set");
            return;
        }
        return this.properties;
    }
}


module.exports = new Properties();