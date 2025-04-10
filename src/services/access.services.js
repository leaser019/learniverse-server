'use strict'

const UserModel = require('../models/user.models')
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const { logger } = require('../configs/config.logger')
const KeyTokenService = require('./keytoken.services')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const UserRole = {
  ADMIN: '001',
  USER: '002'
}

class AccessService {
  static signUp = async ({ username, password, email }) => {
    try {
      const checkUser = await UserModel.findOne({ username }).lean()
      if (checkUser) {
        return { code: 409, message: 'Username already exists' }
      }
      const passwordHash = await bycrypt.hash(password, 10)
      const newUser = await UserModel.create({
        username,
        password: passwordHash,
        email,
        role: [UserRole.USER]
      })
      if (newUser) {
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 4096 })
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const keyStore = await KeyTokenService.createKeyToken({ userId: newUser._id, publicKey, privateKey })
        if (!keyStore) {
          return { code: 500, message: 'Failed to create key token' }
        }
        const token = await createTokenPair({ userId: newUser._id, email }, privateKey, publicKey)
        return {
          code: 201,
          message: 'User signed up successfully',
          metadata: {
            user: getInfoData({ field: ['_id', 'username', 'email'], object: newUser }),
            token
          }
        }
      }
      return { code: 200, message: 'User signed up fail', metadata: null }
    } catch (error) {
      logger.warn('Error during signup:', error)
      return { code: 500, message: 'Internal server error', error }
    }
  }
}
module.exports = AccessService
