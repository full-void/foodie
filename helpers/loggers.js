const winston = require("winston");

let logger = winston.createLogger({
    level: process.env.LOGGER_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [new winston.transports.Console()]
});

module.exports = {logger};
