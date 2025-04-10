'use strict'

const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controllers')

router.post('/user/signup', AccessController.signup)
router.post('/user/login', AccessController.login)

module.exports = router
