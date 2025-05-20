'use strict'
const CodingChallengeModel = require('../models/codingChallenge.models')
const { BadRequestError, NotFoundError } = require('../core/error.response')

class ChallengeService {
  async createChallenge({
    title, 
    description, 
    difficulty, 
    categories,
    supportedLanguages, 
    defaultLanguage, 
    points, 
    timeLimit,
    startCode, 
    testCases, 
    solution, 
    hints,
    dailyChallenge = false,
    createdBy
  }) {
    try {
      const newChallenge = await CodingChallengeModel.create({
        title, 
        description, 
        difficulty, 
        categories,
        supportedLanguages, 
        defaultLanguage, 
        points, 
        timeLimit,
        startCode, 
        testCases, 
        solution, 
        hints,
        dailyChallenge,
        createdBy
      })
      
      return newChallenge
    } catch (error) {
      throw new BadRequestError('Cannot create challenge: ' + error.message)
    }
  }

  async findChallengeById(challengeId) {
    return await CodingChallengeModel.findById(challengeId).lean()
  }

  async findChallengeByCondition(filter) {
    return await CodingChallengeModel.find(filter).lean()
  }

  async updateChallenge(challengeId, updateData) {
    const challenge = await CodingChallengeModel.findById(challengeId)
    if (!challenge) throw new NotFoundError('Challenge not found')

    Object.assign(challenge, updateData)
    await challenge.save()
    return challenge
  }

  async deleteChallenge(challengeId) {
    const result = await CodingChallengeModel.findByIdAndDelete(challengeId)
    if (!result) throw new NotFoundError('Challenge not found')
    return { message: 'Challenge deleted successfully' }
  }

  async getAllChallenges(filter = {}, options = {}) {
    const { limit = 20, page = 1, sortBy = 'createdAt', order = 'desc' } = options
    const skip = (page - 1) * limit

    const sortOptions = {}
    sortOptions[sortBy] = order === 'desc' ? -1 : 1

    const challenges = await CodingChallengeModel
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await CodingChallengeModel.countDocuments(filter)

    return {
      data: challenges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getDailyChallenge() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find a challenge marked as daily challenge
    let dailyChallenge = await CodingChallengeModel.findOne({ 
      dailyChallenge: true 
    }).lean()

    // If no challenge is marked as daily, select a random one and mark it
    if (!dailyChallenge) {
      const count = await CodingChallengeModel.countDocuments()
      const random = Math.floor(Math.random() * count)
      
      dailyChallenge = await CodingChallengeModel
        .findOne()
        .skip(random)
        .lean()

      if (dailyChallenge) {
        await CodingChallengeModel.updateMany(
          { dailyChallenge: true },
          { $set: { dailyChallenge: false } }
        )
        
        await CodingChallengeModel.findByIdAndUpdate(
          dailyChallenge._id, 
          { dailyChallenge: true }
        )
      }
    }

    return dailyChallenge
  }
}

module.exports = new ChallengeService()
