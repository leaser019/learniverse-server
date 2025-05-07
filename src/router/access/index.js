'use strict'

const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controllers')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

router.post('/signup', AccessController.signup)
router.post('/login', AccessController.login)
router.post('/refresh-token', AccessController.refreshToken)
router.use(authentication)
router.post('/logout', AccessController.logout)

module.exports = router
