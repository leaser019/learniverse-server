'use strict'

const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controllers')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

router.post('/signup', asyncHandler(AccessController.signup))
router.post('/login', asyncHandler(AccessController.login))
router.post('/refresh-token', asyncHandler(AccessController.refreshToken))
// router.use(authentication)
router.post('/logout', asyncHandler(AccessController.logout))

module.exports = router
