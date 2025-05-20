'use strict'

const AccessService = require('../services/access.services')
const KeyTokenService = require('../services/keytoken.services')
const { SuccessResponse, CREATED } = require('../core/success.response')
const jwt = require('jsonwebtoken')
const { createTokenPair } = require('../auth/authUtils')
const { logger } = require('express-winston')

class AccessController {
  logout = async (req, res, next) =>
    new SuccessResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)

  signup = async (req, res, next) => {
    new CREATED({
      message: 'User signed up successfully',
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const userFound = await AccessService.login({ email, password })

      if (!userFound) {
        return res.status(401).json({
          code: 'INVALID_CREDENTIALS',
          status: 'error',
          message: 'Invalid email or password'
        })
      }
      res.cookie('accessToken', userFound.token.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
      })
      res.cookie('refreshToken', userFound.token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      return res.status(200).json({
        code: 'LOGIN_SUCCESS',
        status: 'success',
        metadata: userFound
      })
    } catch (error) {
      next(error)
    }
  }
  refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        return res.status(401).json({
          code: 'REFRESH_TOKEN_MISSING',
          status: 'error',
          message: 'Refresh token not found'
        })
      }

      const foundToken = await KeyTokenService.findByRefreshToken(refreshToken)

      if (!foundToken) {
        return res.status(401).json({
          code: 'INVALID_REFRESH_TOKEN',
          status: 'error',
          message: 'Invalid refresh token'
        })
      }

      const decoded = jwt.verify(refreshToken, foundToken.privateKey)

      if (!decoded) {
        return res.status(401).json({
          code: 'INVALID_REFRESH_TOKEN',
          status: 'error',
          message: 'Invalid refresh token'
        })
      }

      const tokens = await createTokenPair(
        { userId: decoded.userId, email: decoded.email },
        foundToken.privateKey,
        foundToken.publicKey
      )

      await KeyTokenService.updateRefreshToken(foundToken._id, tokens.refreshToken)

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
      })

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      return res.status(200).json({
        code: 'REFRESH_TOKEN_SUCCESS',
        status: 'success'
      })
    } catch (error) {
      return res.status(500).json({
        code: 'SERVER_ERROR',
        status: 'error',
        message: error.message
      })
    }
  }
}

module.exports = new AccessController()
