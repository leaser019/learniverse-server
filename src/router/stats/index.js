'use strict'
const express = require('express')
const router = express.Router()
const userStatsController = require('../../controllers/userStats.controllers')
const { authentication } = require('../../auth/authUtils')
const { asyncHandler } = require('../../utils/asyncHandler')

// Leaderboard available for all users
router.get('/leaderboard', asyncHandler(userStatsController.getLeaderboard))

// All other routes require authentication
router.use(authentication)

// Stats routes
router.get('/', asyncHandler(userStatsController.getUserStats))
router.get('/challenges', asyncHandler(userStatsController.getUserCompletedChallenges))
router.get('/badges', asyncHandler(userStatsController.getUserBadges))

// Notification routes
router.get('/notifications', asyncHandler(userStatsController.getUserNotifications))
router.get('/notifications/unread-count', asyncHandler(userStatsController.getUnreadCount))
router.patch('/notifications/mark-all-read', asyncHandler(userStatsController.markAllNotificationsAsRead))
router.patch('/notifications/:id', asyncHandler(userStatsController.markNotificationAsRead))
router.delete('/notifications/:id', asyncHandler(userStatsController.deleteNotification))

module.exports = router
