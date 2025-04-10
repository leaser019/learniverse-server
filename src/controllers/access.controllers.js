'use strict'

const AccessService = require('../services/access.services')

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
      const { username, password } = req.body
      res.status(200).json({ message: 'User logged in successfully' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AccessController()
