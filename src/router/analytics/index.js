'use strict'
const express = require('express')
const router = express.Router()
const analyticsController = require('../../controllers/analytics.controllers')
const { authentication } = require('../../auth/authUtils')
const { asyncHandler } = require('../../utils/asyncHandler')

// Tất cả routes yêu cầu authentication
router.use(authentication)

// Thêm middleware để kiểm tra quyền admin (cần triển khai thêm chức năng này)
const isAdmin = (req, res, next) => {
  const user = req.user
  if (user && user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ message: 'Forbidden: Admin access required' })
}

// Tất cả routes analytics đều yêu cầu quyền admin
router.use(isAdmin)

router.get('/users/:userId', asyncHandler(analyticsController.getEventsByUser))
router.get('/events/:eventType', asyncHandler(analyticsController.getEventsByType))
router.get('/stats/daily', asyncHandler(analyticsController.getDailyStats))

module.exports = router
