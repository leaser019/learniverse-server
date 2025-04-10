'use strict'

const keyToken = require('../models/keytoken.models')
const logger = require('../configs/config.logger')

class KeyTokenServices {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    try {
      const token = await keyToken.create({
        user: userId,
        publicKey,
        privateKey
      })
      return token ? token.publicKey : null
    } catch (error) {
      logger.warn('Error creating key token:', error)
      throw new Error('Error creating key token')
    }
  }
}

module.exports = KeyTokenServices
