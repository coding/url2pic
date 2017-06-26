const Koa = require('koa');
const log = require('./log');
const KoaLogger = require('koa-logger');
const Chromium = require('./chromium');

const app = new Koa();

app.use(KoaLogger());

const open_ids = [];

let index = 0;
const chromium = new Chromium();

app.use(async (ctx) => {

    const gk = open_ids[index++];
    const buffer = await chromium.screenshot({
        url: `https://coding.net/u/${gk}/score/share`,
        id: gk,
        width: 600,
        height: 885,
    });
    console.log(buffer && buffer.length);
    ctx.body = buffer;
});

app.on('error', err =>
    log.error(err)
);

module.exports = app;