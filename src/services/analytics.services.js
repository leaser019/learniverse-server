'use strict'
const AnalyticsEventModel = require('../models/analyticsEvent.models')
const { BadRequestError } = require('../core/error.response')

class AnalyticsService {
  async trackEvent(eventType, eventData) {
    try {
      const { userId, timestamp, metadata } = eventData
      
      const analyticsEvent = await AnalyticsEventModel.create({
        eventType,
        userId,
        timestamp,
        metadata
      })
      
      return analyticsEvent
    } catch (error) {
      console.error('Error tracking analytics event:', error)
      throw new BadRequestError('Failed to track event: ' + error.message)
    }
  }
  
  async getEventsByUser(userId, options = {}) {
    const { limit = 100, page = 1, eventType, startDate, endDate } = options
    const skip = (page - 1) * limit
    
    const query = { userId }
    
    if (eventType) {
      query.eventType = eventType
    }
    
    if (startDate || endDate) {
      query.timestamp = {}
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate)
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate)
      }
    }
    
    const events = await AnalyticsEventModel
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await AnalyticsEventModel.countDocuments(query)
    
    return {
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
  
  async getEventsByType(eventType, options = {}) {
    const { limit = 100, page = 1, startDate, endDate } = options
    const skip = (page - 1) * limit
    
    const query = { eventType }
    
    if (startDate || endDate) {
      query.timestamp = {}
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate)
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate)
      }
    }
    
    const events = await AnalyticsEventModel
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await AnalyticsEventModel.countDocuments(query)
    
    return {
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
  
  async generateDailyStats(date = new Date()) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    // Challenge completions
    const challengeCompletionCount = await AnalyticsEventModel.countDocuments({
      eventType: 'CHALLENGE_COMPLETED',
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    })
    
    // Course completions
    const courseCompletionCount = await AnalyticsEventModel.countDocuments({
      eventType: 'COURSE_COMPLETED',
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    })
    
    // Achievements unlocked
    const achievementCount = await AnalyticsEventModel.countDocuments({
      eventType: 'ACHIEVEMENT_UNLOCKED',
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    })
    
    // Active users (unique users with any event)
    const activeUsersCount = await AnalyticsEventModel.distinct('userId', {
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).then(users => users.length)
    
    return {
      date: startOfDay.toISOString().split('T')[0],
      metrics: {
        challengeCompletions: challengeCompletionCount,
        courseCompletions: courseCompletionCount,
        achievementsUnlocked: achievementCount,
        activeUsers: activeUsersCount
      }
    }
  }
}

module.exports = new AnalyticsService()
