'use strict'

const { CodingChallengeService, LeaderboardService, UserChallengeStatsService } = require('../services/codingChallenge.services')

class CodingChallengeController {
  static async createChallenge(req, res) {
    try {
      const data = req.body
      const challenge = await CodingChallengeService.createChallenge(data)
      return res.status(201).json(challenge)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getChallenges(req, res) {
    try {
      const { limit, page, difficulty, category } = req.query
      const challenges = await CodingChallengeService.getChallenges({
        limit: parseInt(limit) || 50,
        page: parseInt(page) || 1,
        difficulty,
        category
      })
      return res.status(200).json(challenges)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getChallengeById(req, res) {
    try {
      const { id } = req.params
      const challenge = await CodingChallengeService.getChallengeById(id)
      return res.status(200).json(challenge)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  static async getDailyChallenge(req, res) {
    try {
      const challenge = await CodingChallengeService.getDailyChallenge()
      return res.status(200).json(challenge)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  static async updateChallenge(req, res) {
    try {
      const { id } = req.params
      const data = req.body
      const challenge = await CodingChallengeService.updateChallenge(id, data)
      return res.status(200).json(challenge)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async deleteChallenge(req, res) {
    try {
      const { id } = req.params
      const result = await CodingChallengeService.deleteChallenge(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

class LeaderboardController {
  static async getLeaderboard(req, res) {
    try {
      const { limit, page } = req.query
      const leaderboard = await LeaderboardService.getLeaderboard({
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1
      })
      return res.status(200).json(leaderboard)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getUserRank(req, res) {
    try {
      const { userId } = req.params
      const rank = await LeaderboardService.getUserRank(userId)
      return res.status(200).json(rank)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }
}

class UserChallengeStatsController {
  static async getUserStats(req, res) {
    try {
      const { userId } = req.params
      const stats = await UserChallengeStatsService.getUserStats(userId)
      return res.status(200).json(stats)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  static async submitChallenge(req, res) {
    try {
      const { userId } = req.params
      const submissionData = req.body
      
      const updatedStats = await UserChallengeStatsService.addSubmission(userId, submissionData)
      return res.status(200).json(updatedStats)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

module.exports = {
  CodingChallengeController,
  LeaderboardController,
  UserChallengeStatsController
}