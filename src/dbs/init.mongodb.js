'use strict'
const mongoose = require('mongoose')
const { logger } = require('../configs/config.logger')

const connectionString = process.env.DEV_MONGODB_URI

class Database {
  constructor() {
    this.connect()
  }

  connect() {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose
      .connect(connectionString)
      .then(() => {
        logger.info('Connected to MongoDB')
      })
      .catch((error) => {
        logger.warn('Error connecting to MongoDB:', error)
      })
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceDatabase = Database.getInstance()
module.exports = instanceDatabase
