'use strict'

const express = require('express')
const router = express.Router()
const { CodingChallengeController, LeaderboardController, UserChallengeStatsController } = require('../../controllers/codingChallenge.controllers')

// Coding Challenge Routes
router.post('/challenges', CodingChallengeController.createChallenge)
router.get('/challenges', CodingChallengeController.getChallenges)
router.get('/challenges/daily', CodingChallengeController.getDailyChallenge)
router.get('/challenges/:id', CodingChallengeController.getChallengeById)
router.put('/challenges/:id', CodingChallengeController.updateChallenge)
router.delete('/challenges/:id', CodingChallengeController.deleteChallenge)

// Leaderboard Routes
router.get('/leaderboard', LeaderboardController.getLeaderboard)
router.get('/leaderboard/users/:userId', LeaderboardController.getUserRank)

// User Challenge Stats Routes
router.get('/users/:userId/stats', UserChallengeStatsController.getUserStats)
router.post('/users/:userId/submissions', UserChallengeStatsController.submitChallenge)

module.exports = router