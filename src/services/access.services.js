'use strict'

const UserModel = require('../models/user.models')
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const { logger } = require('../configs/config.logger')
const KeyTokenService = require('./keytoken.services')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, ConflictRequestError, UnauthorizedRequestError } = require('../core/error.response')
const { findByEmail } = require('./user.services')

const UserRole = {
  ADMIN: '001',
  USER: '002'
}
class AccessService {
  static logout = async (keyStore) => {
    const deleteKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log('deleteKey', deleteKey)
    return deleteKey
  }
  static login = async ({ email, password }) => {
    const userFound = await findByEmail({ email })
    if (!userFound) {
      throw new BadRequestError('User not found')
    }
    const isPasswordValid = await bycrypt.compare(password, userFound.password)
    if (!isPasswordValid) {
      throw new UnauthorizedRequestError('Invalid password')
    }
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    const { _id: userId } = userFound
    const token = await createTokenPair({ userId, email }, privateKey, publicKey)
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken
    })
    return {
      shop: getInfoData({ field: ['_id', 'username', 'email'], object: userFound }),
      token
    }
  }
  static signUp = async ({ username, password, email }) => {
    const checkUser = await UserModel.findOne({ username }).lean()
    if (checkUser) {
      throw new ConflictRequestError('Username already exists')
    }
    const passwordHash = await bycrypt.hash(password, 10)
    const newUser = await UserModel.create({
      username,
      password: passwordHash,
      email,
      role: [UserRole.USER]
    })
    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      const keyStore = await KeyTokenService.createKeyToken({ userId: newUser._id, publicKey, privateKey })
      const token = await createTokenPair({ userId: newUser._id, email }, privateKey, publicKey)
      if (!token) {
        return { code: 500, message: 'Failed to create key token' }
      }
      return {
        user: getInfoData({ field: ['_id', 'username', 'email'], object: newUser }),
        token
      }
    }
  }
}

module.exports = AccessService
