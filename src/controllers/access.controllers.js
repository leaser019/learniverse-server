'use strict'

const AccessService = require('../services/access.services')
const KeyTokenService = require('../services/keytoken.services')
const { createTokenPair } = require('../auth/authUtils')
const jwt = require('jsonwebtoken')

class AccessController {
  constructor() {}

  signup = async (req, res, next) => {
    try {
      return res.status(200).json(await AccessService.signUp(req.body))
    } catch (error) {
      next(error)
    }
  }
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          code: 'MISSING_INPUT',
          status: 'error',
          message: 'Email và password không được để trống!'
        })
      }

      const foundUser = await AccessService.login({ email, password })

      if (!foundUser) {
        return res.status(401).json({
          code: 'INVALID_CREDENTIALS',
          status: 'error',
          message: 'Email hoặc mật khẩu không chính xác!'
        })
      }

      res.cookie('accessToken', foundUser.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
      })

      res.cookie('refreshToken', foundUser.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      return res.status(200).json({
        code: 'LOGIN_SUCCESS',
        status: 'success',
        metadata: {
          user: foundUser.user
        }
      })
    } catch (error) {
      return res.status(500).json({
        code: 'SERVER_ERROR',
        status: 'error',
        message: error.message
      })
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
  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken

      if (refreshToken) {
        await KeyTokenService.removeByRefreshToken(refreshToken)
      }

      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')

      return res.status(200).json({
        code: 'LOGOUT_SUCCESS',
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
