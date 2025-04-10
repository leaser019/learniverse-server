const winston = require('winston')
const expressWinston = require('express-winston')
const path = require('path')
const fs = require('fs')

const logDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const logger = winston.createLogger({
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) =>
      stack
        ? `${timestamp} ${level.toUpperCase()}: ${message} - Stack: ${stack}`
        : `${timestamp} ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log'), maxsize: 5 * 1024 * 1024, maxFiles: 5 }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    })
  ],
  exceptionHandlers: [new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })],
  rejectionHandlers: [new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })]
})

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: 'HTTP {{req.method}} {{req.url}} - {{res.statusCode}} {{res.responseTime}}ms'
})

module.exports = { logger, requestLogger }
