
const { env } = process;

const config = {
    downloadDir: env.downloadDir || './downloads',
    concurrency: env.concurrency || 5,
    port: env.port || '3000',
};

module.exports = config;