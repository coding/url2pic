const Koa = require('koa');
const log = require('./log');
const KoaLogger = require('koa-logger');
const ChromiumService = require('./chromium-service');

const app = new Koa();

app.use(KoaLogger());

const chromiumService = new ChromiumService();

app.use(async (ctx) => {
    if (ctx.path !== '/internal/screenshot') {
        ctx.state = 404;
        return;
    }
    const query = ctx.query;
    const params = {
        width: query.width || 1400,
        height: query.height || 900,
        id: query.id,
        etag: query.etag || 'no',
        force: query.force === 'true',
        url: decodeURIComponent(query.url),
    };
    ctx.body = await chromiumService.screenshot(params);
});

app.on('error', err =>
    log.error(err)
);

module.exports = app;