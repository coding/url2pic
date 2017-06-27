const log = require('./log');
const App = require('./app');
const utils = require('./utils');

class Service {
    static
    init(config) {
        return new Service(config);
    }
    constructor(config) {
        this.config = config;
    }
    serve() {
        this.setup();
        log.info(this.config);
        App(this.config).listen(this.config.port);
    }
    async setup() {
        await utils.createDir(this.config.downloadDir);
    }
}

module.exports = Service;
