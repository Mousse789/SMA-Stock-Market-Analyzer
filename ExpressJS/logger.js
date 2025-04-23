import winston, { format, transports } from "winston"
import { DateTime } from 'luxon'

const logFormat = format.printf(({level, message}) => {
    const dateFormat = DateTime.now().setZone('UTC-7')
    return `{time: ${dateFormat} level: ${level} message: ${message}}`
})

export const getLoggerInstance = (service) => {
    const logger = winston.createLogger({
        level: 'info',
        format: format.json(),
        transports: [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    logFormat
                )
            }),
            new transports.File({
                filename: 'combined.log',
                format: logFormat
            }),
            new transports.File({
                level: 'error',
                filename: 'errors.log',
                format: logFormat
            })
        ],
        exceptionHandlers: [
            new transports.File({ filename: 'exceptions.log' })
        ],
        rejectionHandlers: [
            new transports.File({ filename: 'rejections.log' })
        ]
    })

    return logger
}
