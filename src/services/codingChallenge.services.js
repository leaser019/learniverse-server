'use strict'

const { CodingChallenge, Leaderboard, UserChallengeStats } = require('../models/codingChallenge.models')

class CodingChallengeService {
  static async createChallenge(data) {
    try {
      const newChallenge = await CodingChallenge.create(data)
      return newChallenge
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getChallenges({ limit = 50, page = 1, difficulty, category }) {
    try {
      const query = {}
      if (difficulty) query.difficulty = difficulty
      if (category) query.categories = { $in: [category] }

      const skip = (page - 1) * limit
      const challenges = await CodingChallenge.find(query)
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await CodingChallenge.countDocuments(query)

      return {
        data: challenges,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getChallengeById(id) {
    try {
      const challenge = await CodingChallenge.findOne({ id }).lean()
      if (!challenge) throw new Error('Challenge not found')
      return challenge
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getDailyChallenge() {
    try {
      const challenge = await CodingChallenge.findOne({ dailyChallenge: true }).lean()
      if (!challenge) throw new Error('No daily challenge found')
      return challenge
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateChallenge(id, data) {
    try {
      const updated = await CodingChallenge.findOneAndUpdate({ id }, data, { new: true })
      if (!updated) throw new Error('Challenge not found')
      return updated
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteChallenge(id) {
    try {
      const deleted = await CodingChallenge.findOneAndDelete({ id })
      if (!deleted) throw new Error('Challenge not found')
      return { message: 'Challenge deleted successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

class LeaderboardService {
  static async getLeaderboard({ limit = 10, page = 1 }) {
    try {
      const skip = (page - 1) * limit
      const leaderboard = await Leaderboard.find()
        .sort({ totalPoints: -1, totalSolved: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await Leaderboard.countDocuments()

      return {
        data: leaderboard,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getUserRank(userId) {
    try {
      const user = await Leaderboard.findOne({ userId }).lean()
      if (!user) throw new Error('User not found in leaderboard')
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateUserRank(userData) {
    try {
      const { userId } = userData
      
      const updated = await Leaderboard.findOneAndUpdate(
        { userId }, 
        userData,
        { new: true, upsert: true }
      )
      
      return updated
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

class UserChallengeStatsService {
  static async getUserStats(userId) {
    try {
      const stats = await UserChallengeStats.findOne({ userId }).lean()
      if (!stats) throw new Error('User stats not found')
      return stats
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async createOrUpdateUserStats(userData) {
    try {
      const { userId } = userData
      
      const updated = await UserChallengeStats.findOneAndUpdate(
        { userId },
        userData,
        { new: true, upsert: true }
      )
      
      return updated
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async addSubmission(userId, submissionData) {
    try {
      const userStats = await UserChallengeStats.findOne({ userId })
      if (!userStats) throw new Error('User stats not found')

      userStats.submissions.push(submissionData)
      
      if (submissionData.status === 'Accepted') {
        userStats.totalPoints += submissionData.score
        userStats.totalSolved += 1
        
        const challenge = await CodingChallenge.findOne({ id: submissionData.challengeId })
        if (challenge) {
          switch (challenge.difficulty) {
            case 'Easy': userStats.easySolved += 1; break
            case 'Medium': userStats.mediumSolved += 1; break
            case 'Hard': userStats.hardSolved += 1; break
            case 'Expert': userStats.expertSolved += 1; break
          }
        }
        
        await LeaderboardService.updateUserRank({
          userId,
          totalPoints: userStats.totalPoints,
          totalSolved: userStats.totalSolved
        })
      }
      
      userStats.lastActiveDate = new Date()
      await userStats.save()
      
      return userStats
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  CodingChallengeService,
  LeaderboardService,
  UserChallengeStatsService
}