'use strict'

const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controllers')

router.post('/user/signup', AccessController.signup)
router.post('/user/login', AccessController.login)
router.post('/user/refresh-token', AccessController.refreshToken)
router.post('/user/logout', AccessController.logout)

module.exports = router
