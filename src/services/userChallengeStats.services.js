'use strict'
const UserChallengeStatsModel = require('../models/userChallengeStats.models')
const UserModel = require('../models/user.models')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { NotFoundRequestError } = require('../core/error.response')

class UserChallengeStatsService {
  async createUserStats(userId) {
    const existingStats = await UserChallengeStatsModel.findOne({ userId })
    if (existingStats) {
      return existingStats
    }
    
    // Check if user exists
    const userExists = await UserModel.findById(userId)
    if (!userExists) {
      throw new NotFoundRequestError('User not found')
    }
    
    return await UserChallengeStatsModel.create({ userId })
  }
  
  async findUserStatsById(statsId) {
    return await UserChallengeStatsModel.findById(statsId).lean()
  }
  
  async findUserStatsByUserId(userId) {
    return await UserChallengeStatsModel.findOne({ userId }).lean()
  }
  
  async updateUserStats(userId, updateData) {
    const stats = await UserChallengeStatsModel.findOne({ userId })
    if (!stats) throw new NotFoundRequestError('User stats not found')
    
    Object.assign(stats, updateData)
    await stats.save()
    return stats
  }
  
  async deleteUserStats(userId) {
    const result = await UserChallengeStatsModel.findOneAndDelete({ userId })
    if (!result) throw new NotFoundRequestError('User stats not found')
    return { message: 'User stats deleted successfully' }
  }
  
  async getLeaderboard(filter = {}, options = {}) {
    const { limit = 10, page = 1 } = options
    const skip = (page - 1) * limit
    
    const leaderboard = await UserChallengeStatsModel
      .find(filter)
      .sort({ totalPoints: -1, streakDays: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email')
      .lean()
    
    const total = await UserChallengeStatsModel.countDocuments(filter)
    
    // Format the response with rank
    const formattedLeaderboard = leaderboard.map((entry, index) => {
      const rank = skip + index + 1
      return {
        userId: entry.userId._id,
        username: entry.userId.username,
        avatarUrl: `/avatars/default.png`, // Default avatar if none set
        totalPoints: entry.totalPoints,
        rank,
        totalSolved: entry.totalSolved,
        streakDays: entry.streakDays,
        badges: entry.badges || []
      }
    })
    
    return {
      data: formattedLeaderboard,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
  
  async addBadges(userId, badges) {
    const stats = await UserChallengeStatsModel.findOne({ userId })
    if (!stats) throw new NotFoundRequestError('User stats not found')
    
    stats.badges = [...(stats.badges || []), ...badges]
    await stats.save()
    return stats
  }
  
  async getUserCompletedChallenges(userId) {
    const stats = await UserChallengeStatsModel.findOne({ userId })
    if (!stats) {
      return {
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        expertSolved: 0,
        totalSolved: 0
      }
    }
    
    return {
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      expertSolved: stats.expertSolved,
      totalSolved: stats.totalSolved
    }
  }
  
  async getUserBadges(userId) {
    const stats = await UserChallengeStatsModel.findOne({ userId })
    if (!stats) return []
    
    return stats.badges || []
  }
}

module.exports = new UserChallengeStatsService()
