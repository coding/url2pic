
const _ = require('lodash');

const CDP = require('chrome-remote-interface');
const timeout = require('delay');
const file = require('mz/fs');
const fs = require('fs');
const child_process = require('child_process');

const log = require('./log');

class Chromium {
    constructor() {
        this.defaultParams = {
            userAgent: null,
            viewportWidth: 1440,
            viewportHeight: 900,
            url: "https://coding.net",
            delay: 1,
            format: 'png',
            fullPage: false,
            output: 'screenshot.png',
        }
    }

    callChromium() {
        const uri = this.chromiumUri();
        log.info('starting chromium rpc ' + uri);
        const args = [
            '--headless',
            '--hide-scrollbars',
            // '--remote-debugging-port=9222',
            '--disable-gpu',
        ];
        this.chromium = child_process.spawn(uri, args)
    }

    async screenshot(params={}) {
        return '';
    }
    async qscreenshot(params={}) {
        try {
            return await this._screenshot(_.assign({}, this.defaultParams, params));
        } catch(err) {
            let paramsJson = null;
            try {
                paramsJson = JSON.stringify(params)
            } catch (ignored) {
            }
            log.error('error while screenshoting with options: ' + paramJson + ' with err: ' + err);
        } finally {
            if (this.client) {
                this.client.close();
                this.client = null;
            }
        }
    }

    async test() {
        const client = await CDP();
        const {Page} = client;
        try {
            await Page.enable();
            await Page.navigate({url: 'https://github.com'});
            await Page.loadEventFired();
            const {data} = await Page.captureScreenshot();
            const buffer = Buffer.from(data, 'base64');
            fs.writeFileSync('scrot.png', buffer);
            return buffer;
        } catch (err) {
            console.error(err);
        } finally {
            await client.close();
        }
    }

    async _qscreenshot(params) {

        log.debug('screenshot: ', params);
        
        // Start the Chrome Debugging Protocol
        this.client = await CDP();
        // Extract used DevTools domains.
        const {DOM, Emulation, Network, Page, Runtime} = this.client;

        // Enable events on domains we are interested in.
        await Page.enable();
        await DOM.enable();
        await Network.enable();
        
        const {
            userAgent,
            viewportWidth,
            viewportHeight,
            url,
            delay,
            format,
            fullPage,
            output,
        } = params;

        // If user agent override was specified, pass to Network domain
        if (userAgent) {
            await Network.setUserAgentOverride({userAgent});
        }

        // Set up viewport resolution, etc.
        const deviceMetrics = {
            width: viewportWidth,
            height: viewportHeight,
            deviceScaleFactor: 0,
            mobile: false,
            fitWindow: false,
        };
        await Emulation.setDeviceMetricsOverride(deviceMetrics);
        await Emulation.setVisibleSize({
            width: viewportWidth,
            height: viewportHeight,
        });

        // Navigate to target page
        await Page.navigate({url});

        // Wait for page load event to take screenshot
        await Page.loadEventFired();

        await timeout(delay);

        // If the `fullPage` option was passed, we need to measure the height of
        // the rendered page and use Emulation.setVisibleSize
        if (fullPage) {
            const {root: {nodeId: documentNodeId}} = await DOM.getDocument();
            const {nodeId: bodyNodeId} = await DOM.querySelector({
                selector: 'body',
                nodeId: documentNodeId,
            });
            const {model: {height}} = await DOM.getBoxModel({nodeId: bodyNodeId});

            await Emulation.setVisibleSize({width: viewportWidth, height: height});
            // This forceViewport call ensures that content outside the viewport is
            // rendered, otherwise it shows up as grey. Possibly a bug?
            await Emulation.forceViewport({x: 0, y: 0, scale: 1});
        }

        // const screenshot = await Page.captureScreenshot({format});
        const screenshot = await Page.captureScreenshot();
        const buffer = Buffer.from(screenshot.data, 'base64');
        await file.writeFile(output, buffer, 'base64');
        console.log('Screenshot saved');
        return buffer;
    }
}

module.exports = Chromium;