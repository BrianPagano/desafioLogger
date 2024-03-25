const winston = require ('winston')
const customWinston = require('./custom.winston')

const winstonlogger = winston.createLogger ({
    levels: customWinston.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customWinston.colors }),
                winston.format.simple(),
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple() })
    ]
})

module.exports = winstonlogger