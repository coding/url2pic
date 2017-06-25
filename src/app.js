const Koa = require('koa');
const log = require('./log');
const KoaLogger = require('koa-logger');
const Chromium = require('./chromium');

const app = new Koa();

app.use(KoaLogger());



app.use(async (ctx) => {
    const chromium = new Chromium();
    const buffer = await chromium.screenshot({
        url: 'https://coding.net/u/wusisu/score/share',
        viewportWidth: 400,
        delay: 1000,
    });
    console.log(buffer && buffer.length)
    ctx.body = buffer;
});

app.on('error', err =>
    log.error(err)
);

module.exports = app;