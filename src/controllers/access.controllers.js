'use strict'

const AccessService = require('../services/access.services')

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
      const { username, password } = req.body
      res.status(200).json({ message: 'User logged in successfully' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AccessController()
