const log = require('./log');
const App = require('./app');

class Service {
    static
    init(config) {
        return new Service(config);
    }
    constructor(config) {
        this.config = config;
    }
    serve() {
        log.info(this.config);
        App.listen(3000);
    }
}

module.exports = Service;
