'use strict'

const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { UnauthorizedRequestError, NotFoundRequestError } = require('../core/error.response')
const KeyTokenService = require('../services/keytoken.services')
const { logger } = require('../configs/config.logger')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'Content-Type'
}

const createTokenPair = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: '1 days'
    })
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days'
    })
    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        throw new Error('Invalid access token')
      }
      return decoded
    })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new Error('Error creating token pair', error)
  }
}

/**
 * 1. check if user id missing in payload
 * 2. get acess token from header
 * 3. verify access token
 * 4. check user in db
 * 5. check keyStore
 * 6. ok => next()
 */
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString()
  if (!userId) {
    throw new UnauthorizedRequestError('Invalid User ID Request')
  }
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) {
    throw new NotFoundRequestError('Invalid Key Request')
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) {
    throw new UnauthorizedRequestError('Invalid Access Token Request')
  }
  try {
    const decoded = jwt.verify(accessToken, keyStore.publicKey)
    if (decoded.userId !== userId) {
      throw new UnauthorizedRequestError('Invalid Access Token')
    }
    req.keyStore = keyStore
    return next()
  } catch (error) {
    logger.warn('Error verifying access token:', error)
    throw error
  }
})

module.exports = {
  createTokenPair,
  authentication
}
