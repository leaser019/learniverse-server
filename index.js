require('dotenv').config()
const app = require('./src/app.js')
const { logger } = require('./src/configs/config.logger')
const PORT = process.env.PORT || 4000

// For Vercel serverless deployment
module.exports = app

// For local development
if (require.main === module) {
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
}
