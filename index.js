const app = require('./src/app.js')
const { logger } = require('./src/configs/config.logger')
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  logger.info('Connected!')
})

process.on('SIGINT', () => {
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})
