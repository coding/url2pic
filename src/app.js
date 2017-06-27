const Koa = require('koa');
const log = require('./log');
const KoaLogger = require('koa-logger');
const ChromiumService = require('./chromium-service');

const App = function (config) {
    const app = new Koa();

    app.use(KoaLogger());

    const chromiumService = new ChromiumService(config);

    app.use(async (ctx) => {
        if (ctx.path !== '/internal/screenshot') {
            ctx.state = 404;
            return;
        }
        // cache is ok
        if (ctx.fresh) {
            ctx.status = 304;
            return;
        }
        const query = ctx.query;
        const params = {
            width: query.width || 1440,
            height: query.height || 900,
            id: query.id,
            etag: query.etag || 'no',
            force: query.force === 'true',
            url: decodeURIComponent(query.url),
        };
        const data = await chromiumService.screenshot(params);
        ctx.status = 200;
        ctx.type = 'png';
        ctx.etag = query.etag;
        ctx.body = data;
    });

    app.on('error', err =>
        log.error(err)
    );

    return app;
};

module.exports = App;