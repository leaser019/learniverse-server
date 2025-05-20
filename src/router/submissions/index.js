'use strict'
const express = require('express')
const router = express.Router()
const submissionController = require('../../controllers/submission.controllers')
const { authentication } = require('../../auth/authUtils')
const { asyncHandler } = require('../../utils/asyncHandler')

// Tất cả routes đều yêu cầu authentication
router.use(authentication)

router.post('/', asyncHandler(submissionController.submitChallenge))
router.get('/user', asyncHandler(submissionController.getUserSubmissions))
router.get('/best/:challengeId', asyncHandler(submissionController.getBestSubmission))
router.get('/:id', asyncHandler(submissionController.getSubmissionById))

module.exports = router
