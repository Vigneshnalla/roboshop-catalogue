const pino = require('pino');

const logger = pino({
    level: 'info',
    prettyPrint: false,
    useLevelLabels: true,
});

module.exports = logger;
