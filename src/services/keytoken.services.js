'use strict'

const keyTokenModal = require('../models/keytoken.models')
const { logger } = require('../configs/config.logger')
const { Types } = require('mongoose')

class KeyTokenServices {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      const filter = { user: userId }
      const updatedData = {
        publicKey,
        privateKey,
        refreshToken,
        refreshTokensUsed: []
      }
      const options = { new: true, upsert: true }
      const token = await keyTokenModal.findOneAndUpdate(filter, updatedData, options)
      return token ? token.publicKey : null
    } catch (error) {
      logger.warn('Error creating key token:', error)
      return error
    }
  }
  static async findByRefreshToken(refreshToken) {
    return await keyToken.findOne({ refreshToken: { $in: [refreshToken] } })
  }
  static async findByUserId(userId) {
    try {
      const res = await keyTokenModal.findOne({ user: new Types.ObjectId(userId) })
      return res
    } catch (error) {
      logger.warn('Error finding key token:', error)
      return error
    }
  }

  static async removeKeyById(id) {
    return await keyTokenModal.findByIdAndDelete(id)
  }

  static async updateRefreshToken(id, newRefreshToken) {
    return await keyTokenModal.findByIdAndUpdate(
      id,
      {
        $push: { refreshToken: newRefreshToken }
      },
      { new: true }
    )
  }
}
module.exports = KeyTokenServices
