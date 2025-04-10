const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const { logger } = require('../configs/config.logger')

const countConnection = () => {
  const numConnection = mongoose.connections.length
  if (numConnection > 0) {
    logger.info(`Connected to ${numConnection} database(s)`)
  } else {
    logger.info('No active database connections')
  }
}

const checkOverload = () => {
  const checkPerSecond = 5000
  setInterval(() => {
    const numberConnection = mongoose.connections.length
    const numCore = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    if (numberConnection > numCore) {
      logger.warn(`High number of connections: ${numberConnection} connections`)
    }
    if (memoryUsage > 100 * 1024 * 1024) {
      logger.warn(`High memory usage: ${Math.round(memoryUsage / 1024 / 1024)} MB`)
    }
  }, checkPerSecond)
}

module.exports = { countConnection, checkOverload }
