'use strict'
const express = require('express')
const router = express.Router()
const challengeController = require('../../controllers/challenge.controllers')
const { authentication } = require('../../auth/authUtils')
const { asyncHandler } = require('../../utils/asyncHandler')

// Routes không yêu cầu authentication
router.get('/daily', asyncHandler(challengeController.getDailyChallenge))
router.get('/', asyncHandler(challengeController.getAllChallenges))
router.get('/:id', asyncHandler(challengeController.getChallengeById))

// Routes yêu cầu authentication
router.use(authentication)
router.post('/', asyncHandler(challengeController.createChallenge))
router.patch('/:id', asyncHandler(challengeController.updateChallenge))
router.delete('/:id', asyncHandler(challengeController.deleteChallenge))

module.exports = router
