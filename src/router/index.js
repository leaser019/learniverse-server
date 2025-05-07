'use strict'
const express = require('express')
const router = express.Router()
const { apiKey, permission } = require('../auth/checkAuth')

// Middleware to check API key
router.use(apiKey)
router.use('/v1/api/user', require('./access'))
router.use(permission('002'))

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to Learniverse' })
})

module.exports = router
