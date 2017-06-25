const log = require('./log');
const App = require('./app');
const ChromiumRunner = require('./chromium-runner');

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
        // new ChromiumRunner().start();
        App.listen(3000);
    }
}

module.exports = Service;
