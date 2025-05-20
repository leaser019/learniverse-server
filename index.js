const app = require('./src/app.js')
const { logger } = require('./src/configs/config.logger')
const PORT = process.env.PORT || 8080
const { initializeObservers } = require('./src/patterns/observerInit')

// Initialize observers for the Observer pattern
initializeObservers()

const server = app.listen(PORT, () => {
  logger.info(`Connected! Server is running on port ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})
