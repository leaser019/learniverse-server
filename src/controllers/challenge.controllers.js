'use strict'
const ServiceFactory = require('../patterns/serviceFactory')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

// Lấy service thông qua Factory Pattern
const challengeService = ServiceFactory.getService('challenge')

class ChallengeController {
  async createChallenge(req, res) {
    const {
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
      dailyChallenge
    } = req.body

    const createdBy = req.user.id

    const challenge = await challengeService.create({
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

    return new CREATED({
      message: 'Challenge created successfully',
      metadata: challenge
    }).send(res)
  }

  async getChallengeById(req, res) {
    const { id } = req.params
    const challenge = await challengeService.findById(id)

    return new OK({
      message: 'Challenge retrieved successfully',
      metadata: challenge
    }).send(res)
  }

  async getAllChallenges(req, res) {
    const { page = 1, limit = 20, difficulty, category, sortBy, order } = req.query

    // Xây dựng filter
    const filter = {}
    if (difficulty) {filter.difficulty = difficulty}
    if (category) {filter.categories = { $in: [category] }} 

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy: sortBy || 'createdAt',
      order: order || 'desc'
    }

    const challengesData = await challengeService.list(filter, options)

    return new OK({
      message: 'Challenges retrieved successfully',
      metadata: challengesData
    }).send(res)
  }

  async updateChallenge(req, res) {
    const { id } = req.params
    const updateData = req.body

    const updatedChallenge = await challengeService.update(id, updateData)

    return new OK({
      message: 'Challenge updated successfully',
      metadata: updatedChallenge
    }).send(res)
  }

  async deleteChallenge(req, res) {
    const { id } = req.params
    const result = await challengeService.delete(id)

    return new OK({
      message: 'Challenge deleted successfully',
      metadata: result
    }).send(res)
  }

  async getDailyChallenge(req, res) {
    // Sử dụng phương thức trực tiếp từ service gốc vì đây là method đặc biệt
    // không nằm trong interface chung của ServiceInterface
    const dailyChallenge = await require('../services/challenge.services').getDailyChallenge()

    return new OK({
      message: 'Daily challenge retrieved successfully',
      metadata: dailyChallenge
    }).send(res)
  }
}

module.exports = new ChallengeController()
