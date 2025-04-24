'use strict'

const AccessService = require('../services/access.services')
const { CREATED, SuccessResponse } = require('../core/success.response')

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
    new SuccessResponse({
      message: 'Login successfully',
      metadata: await AccessService.login(req.body)
    }).send(res)
  }
}

module.exports = new AccessController()
