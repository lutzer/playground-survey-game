import winston from 'winston'
import path from 'path'

const devMode = process.argv.includes('-dev')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        //winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({level, message, timestamp}) => {
            return `${timestamp} [${level}] ${message}`
        })
    ),
    transports: devMode ? 
        [new winston.transports.Console()] : 
        [new winston.transports.Console(), new winston.transports.File({ 
            filename: path.resolve(__dirname,'../logs/server.log'),
            maxsize: 20 * 1024 * 1024
        })]
})

export { logger }