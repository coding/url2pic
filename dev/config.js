
const { env } = process;

const config = {
    downloadDir: env.downloadDir || './downloads',
    concurrency: env.concurrency || 5,
    port: env.port || '3000',
    chromiumExec: env.chromiumExec || 'google-chrome',
    timeout: env.timeout || 2500,
    VirtualTimeBudget: env.VirtualTimeBudget || 1500,
};

module.exports = config;