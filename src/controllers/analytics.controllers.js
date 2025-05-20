'use strict'
const analyticsService = require('../services/analytics.services')
const { OK } = require('../core/success.response')
const { asyncHandler } = require('../utils/asyncHandler')

class AnalyticsController {
  async getEventsByUser(req, res) {
    const { userId } = req.params
    const { limit, page, eventType, startDate, endDate } = req.query

    const options = {
      limit: parseInt(limit) || 100,
      page: parseInt(page) || 1,
      eventType,
      startDate,
      endDate
    }

    const events = await analyticsService.getEventsByUser(userId, options)

    return new OK({
      message: 'User events retrieved successfully',
      metadata: events
    }).send(res)
  }

  async getEventsByType(req, res) {
    const { eventType } = req.params
    const { limit, page, startDate, endDate } = req.query

    const options = {
      limit: parseInt(limit) || 100,
      page: parseInt(page) || 1,
      startDate,
      endDate
    }

    const events = await analyticsService.getEventsByType(eventType, options)

    return new OK({
      message: 'Events retrieved successfully',
      metadata: events
    }).send(res)
  }

  async getDailyStats(req, res) {
    const { date } = req.query
    const targetDate = date ? new Date(date) : new Date()

    const stats = await analyticsService.generateDailyStats(targetDate)

    return new OK({
      message: 'Daily stats retrieved successfully',
      metadata: stats
    }).send(res)
  }
}

// Export as a singleton
module.exports = new AnalyticsController()
