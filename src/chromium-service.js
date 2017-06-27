
const async = require('async');
const Chromium = require('./chromium');

class ChromiumService {
    constructor(config) {
        this.config = config;
        this.chromium = new Chromium(config);
        this.queue = async.queue(this.worker.bind(this), config.concurrency);
    }

    async screenshot(params) {
        params.action = 'screenshot';
        return new Promise((resolve, reject) => {
            params.finishCallback = resolve;
            this.queue.push(params, reject);
        });
    }

    worker(task, cb) {
        if (task.action === 'screenshot') {
            this.chromium.screenshot(task).then(task.finishCallback).then(cb).catch(cb);
            return;
        }
        log.error('should not come here.');
        task.finishCallback();
        cb();
    }
}

module.exports = ChromiumService;