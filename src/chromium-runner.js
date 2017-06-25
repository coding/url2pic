
// const fs = require('fs');
const child_process = require('child_process');

const log = require('./log');

class ChromiumRunner {
    constructor(config) {
        this.config = config;
    }
    chromiumUri() {
        return this.config || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        // TODO: use configurable chromium and rpc port
        // chromium-browser
        // fs.stat()
    }
    async start() {
        if (process.env.NODE_ENV === 'development' && process.env.pm2_watching === 'true') {
            return;
        }
        const uri = this.chromiumUri();
        log.info('starting chromium rpc ' + uri);
        const args = [
            '--headless',
            // '--hide-scrollbars',
            '--remote-debugging-port=9222',
            // '--disable-gpu',
        ];
        this.chromium = child_process.spawn(uri, args)
    }
}

module.exports = ChromiumRunner;