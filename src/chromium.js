
const path = require('path');
const fs = require('mz/fs');
const child_process = require('mz/child_process');
const _ = require('lodash');

const log = require('./log');

class Chromium {
    constructor() {
        this.defaultParams = {
            userAgent: null,
            width: 1440,
            height: 900,
            url: "https://coding.net",
            id: 'default',
        }
    }

    chromiumUri() {
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    async createDir(dirPath) {
        try {
            await fs.mkdir(dirPath);
            log.debug(dirPath + ' created');
        } catch (e) {
            log.debug(dirPath + ' exists.' + e);
        }
    }

    callChromium(params) {
        const uri = this.chromiumUri();
        const args = [
            '--headless',
            '--hide-scrollbars',
            '--disable-gpu',
            `--window-size=${params.width},${params.height}`,
            '--screenshot'
        ];
        args.push(params.url);
        const options = {
            cwd: params.path,
            timeout: 1
        };
        const chromium = child_process.spawn(uri, args, options);
        return new Promise((resolve, reject) => {
            chromium.on('close', function (code) {
                log.debug('chromium exits with code ' + code);
                resolve(code);
            });
            chromium.on('error', function (err) {
                log.error('chromium error:' + err);
                reject(err);
            })
        })
    }

    async readFromFile(dirPath) {
        try {
            return await fs.readFile(path.join(dirPath, 'screenshot.png'));
        } catch (err) {
            log.error(`read ${dirPath} failed with error: ${err}`);
            return null;
        }
    }

    async screenshot(userParams={}) {
        const params = _.extend({}, this.defaultParams, userParams);
        params.path = path.join('./downloads', params.id);
        await this.createDir(params.path);
        await this.callChromium(params);
        return await this.readFromFile(params.path);
    }
}

module.exports = Chromium;