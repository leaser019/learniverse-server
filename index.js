const app = require('./src/app.js')
const { logger } = require('./src/configs/config.logger')
const PORT = process.env.PORT || 4000

console.log(`Server is running on port ${PORT}`)

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  logger.info('Connected!')
})

process.on('SIGINT', () => {
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})
