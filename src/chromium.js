
const path = require('path');
const fs = require('mz/fs');
const child_process = require('mz/child_process');
const _ = require('lodash');

const log = require('./log');
const utils = require('./utils');

class Chromium {
    constructor(config) {
        this.defaultParams = {
            userAgent: null,
            width: 1440,
            height: 900,
            url: "https://coding.net",
            id: 'default',
            action: 'screenshot',
            force: false,
            etag: 'no',
        }
        this.config = config;
    }

    chromiumUri() {
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    async checkEtagFresh(params) {
        if (!params.etag) return true;
        try {
            const lastEtag = await fs.readFile(path.join(params.path, 'etag.txt'), 'utf8');
            console.log(lastEtag, params.etag)
            return lastEtag !== params.etag;
        } catch (e) {
            log.warn(`error when fetching etag ${params.path}, error: ${e}`);
            return true;
        }
    }

    async writeEtag(params) {
        if (!params.etag) return;
        try {
            await fs.writeFile(path.join(params.path, 'etag.txt'), params.etag);
        } catch (e) {
            log.warn(`error when writing etag ${params.path}, error: ${e}`);
        }
    }

    callChromium(params) {
        const uri = this.chromiumUri();
        const args = [
            '--headless',
            '--hide-scrollbars',
            '--disable-gpu',
            `--window-size=${params.width},${params.height}`,
            '--screenshot',
        ];
        args.push(params.url);
        const options = {
            cwd: params.path,
        };
        log.debug(`${uri} ${args.join(' ')}`);
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
        params.path = path.join(this.config.downloadDir, params.id);
        if (params.force || await this.checkEtagFresh(params)) {
            await utils.createDir(params.path);
            await this.callChromium(params);
            await this.writeEtag(params);
        }
        return await this.readFromFile(params.path);
    }
}

module.exports = Chromium;