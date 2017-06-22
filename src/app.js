const Koa = require('koa');
const log = require('./log');
const KoaLogger = require('koa-logger');

const app = new Koa();

app.use(KoaLogger());

app.use(async (ctx) => {
    ctx.body = 'hello world';
});

app.on('error', err =>
    log.error(err)
);

module.exports = app;