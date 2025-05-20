'use strict'
const express = require('express')
const router = express.Router()
const { apiKey, permission } = require('../auth/checkAuth')
const { authentication } = require('../auth/authUtils')

// Middleware to check API key
router.use(apiKey)
router.use('/v1/api/user', require('./access'))
router.use('/v1/api/courses', require('./courses'))
router.use('/v1/api/challenges', require('./challenges'))
router.use('/v1/api/submissions', require('./submissions'))
router.use('/v1/api/stats', require('./stats'))
router.use('/v1/api/analytics', require('./analytics'))
router.use(permission('002'))
router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to Learniverse' })
})
router.use(authentication)

module.exports = router
