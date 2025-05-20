'use strict'
const NotificationModel = require('../models/notification.models')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { NotFoundRequestError } = require('../core/error.response')

class NotificationService {
  async sendNotification(userId, notificationData) {
    try {
      const notification = await NotificationModel.create({
        userId,
        ...notificationData
      })
      
      return notification
    } catch (error) {
      throw new BadRequestError('Failed to send notification: ' + error.message)
    }
  }
  
  async getUserNotifications(userId, { limit = 10, page = 1, read = null }) {
    const query = { userId }
    if (read !== null) query.read = read
    
    const skip = (page - 1) * limit
    
    const notifications = await NotificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await NotificationModel.countDocuments(query)
    
    return {
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
  
  async markAsRead(userId, notificationId) {
    const notification = await NotificationModel.findOne({
      _id: notificationId,
      userId
    })
    
    if (!notification) {
      throw new NotFoundRequestError('Notification not found')
    }
    
    notification.read = true
    await notification.save()
    
    return notification
  }
  
  async markAllAsRead(userId) {
    await NotificationModel.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    )
    
    return { message: 'All notifications marked as read' }
  }
  
  async deleteNotification(userId, notificationId) {
    const result = await NotificationModel.findOneAndDelete({
      _id: notificationId,
      userId
    })
    
    if (!result) {
      throw new NotFoundRequestError('Notification not found')
    }
    
    return { message: 'Notification deleted successfully' }
  }
  
  async getUnreadCount(userId) {
    const count = await NotificationModel.countDocuments({
      userId,
      read: false
    })
    
    return { count }
  }
}

module.exports = new NotificationService()
