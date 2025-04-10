'use strict'

const jwt = require('jsonwebtoken')

const createTokenPair = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: '2 days'
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

module.exports = {
  createTokenPair
}
