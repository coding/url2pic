
const fs = require('mz/fs');

const log = require('./log');

exports.createDir = async function createDir(dirPath) {
    try {
        await fs.mkdir(dirPath);
        log.debug(dirPath + ' created');
    } catch (e) {
        log.debug(dirPath + ' exists.' + e);
    }
};