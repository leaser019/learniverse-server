'use strict'

const keyToken = require('../models/keytoken.models')
const logger = require('../configs/config.logger')

class KeyTokenServices {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      const filter = { user: userId }
      const update = {
        publicKey,
        privateKey,
        refreshTokens: [refreshToken]
      }
      const options = { upsert: true, new: true }

      const tokens = await keyToken.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      logger.warn('Error creating key token:', error)
      throw new Error('Error creating key token')
    }
  }
  static async findByRefreshToken(refreshToken) {
    return await keyToken.findOne({ refreshToken: { $in: [refreshToken] } })
  }

  static async updateRefreshToken(id, newRefreshToken) {
    return await keyToken.findByIdAndUpdate(
      id,
      {
        $push: { refreshToken: newRefreshToken }
      },
      { new: true }
    )
  }
}
module.exports = KeyTokenServices
