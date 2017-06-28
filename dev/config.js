
const { env } = process;

const config = {
    downloadDir: env.downloadDir || './downloads',
    concurrency: env.concurrency || 5,
    port: env.port || '3000',
    chromiumExec: env.chromiumExec || 'google-chrome',
};

module.exports = config;