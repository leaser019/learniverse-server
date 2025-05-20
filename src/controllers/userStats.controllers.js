'use strict'
const ServiceFactory = require('../patterns/serviceFactory')
const { OK, SuccessResponse } = require('../core/success.response')

// Lấy service thông qua Factory Pattern
const statsService = ServiceFactory.getService('stats')
const notificationService = require('../services/notification.services')

class UserStatsController {
  async getUserStats(req, res) {
    const userId = req.user.id
    
    // Tạo stats nếu chưa tồn tại
    let stats = await statsService.findByCondition({ userId })
    
    if (!stats) {
      stats = await statsService.create({ userId })
    }
    
    return new OK({
      message: 'User stats retrieved successfully',
      metadata: stats
    }).send(res)
  }
  
  async getUserCompletedChallenges(req, res) {
    const userId = req.user.id
    
    const completedChallenges = await require('../services/userChallengeStats.services')
      .getUserCompletedChallenges(userId)
    
    return new OK({
      message: 'Completed challenges retrieved successfully',
      metadata: completedChallenges
    }).send(res)
  }
  
  async getUserBadges(req, res) {
    const userId = req.user.id
    
    const badges = await require('../services/userChallengeStats.services')
      .getUserBadges(userId)
    
    return new OK({
      message: 'User badges retrieved successfully',
      metadata: badges
    }).send(res)
  }
  
  async getLeaderboard(req, res) {
    const { page = 1, limit = 10 } = req.query
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    }
    
    const leaderboard = await statsService.list({}, options)
    
    return new OK({
      message: 'Leaderboard retrieved successfully',
      metadata: leaderboard
    }).send(res)
  }
  
  // Notifications
  async getUserNotifications(req, res) {
    const userId = req.user.id
    const { page = 1, limit = 10, read } = req.query
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      read: read === 'true' ? true : read === 'false' ? false : null
    }
    
    const notifications = await notificationService.getUserNotifications(userId, options)
    
    return new OK({
      message: 'Notifications retrieved successfully',
      metadata: notifications
    }).send(res)
  }
  
  async markNotificationAsRead(req, res) {
    const userId = req.user.id
    const { id } = req.params
    
    const notification = await notificationService.markAsRead(userId, id)
    
    return new OK({
      message: 'Notification marked as read',
      metadata: notification
    }).send(res)
  }
  
  async markAllNotificationsAsRead(req, res) {
    const userId = req.user.id
    
    const result = await notificationService.markAllAsRead(userId)
    
    return new OK({
      message: 'All notifications marked as read',
      metadata: result
    }).send(res)
  }
  
  async deleteNotification(req, res) {
    const userId = req.user.id
    const { id } = req.params
    
    const result = await notificationService.deleteNotification(userId, id)
    
    return new OK({
      message: 'Notification deleted successfully',
      metadata: result
    }).send(res)
  }
  
  async getUnreadCount(req, res) {
    const userId = req.user.id
    
    const count = await notificationService.getUnreadCount(userId)
    
    return new OK({
      message: 'Unread count retrieved successfully',
      metadata: count
    }).send(res)
  }
}

module.exports = new UserStatsController()
