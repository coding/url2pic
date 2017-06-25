const Koa = require('koa');
const log = require('./log');
const KoaLogger = require('koa-logger');
const Chromium = require('./chromium');

const app = new Koa();

app.use(KoaLogger());

app.use(async (ctx) => {
    // ctx.body = 'hello world';
    const chromium = new Chromium();
    const buffer = await chromium.screenshot({
        url: 'https://coding.net/u/wusisu/score/share',
        viewportWidth: 400,
        delay: 3000,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
    });
    // const buffer = await chromium.test();
    console.log(buffer && buffer.length)
    ctx.body = buffer;
});

app.on('error', err =>
    log.error(err)
);

module.exports = app;