'use strict'
const { 
  BadgeSystemObserver, 
  NotificationObserver, 
  AnalyticsObserver, 
  ChallengeSubmissionSubject, 
  CourseCompletionSubject, 
  UserAchievementSubject 
} = require('../patterns/observerPattern')

// Khởi tạo services cần thiết
const userChallengeStatsService = require('../services/userChallengeStats.services')
const notificationService = require('../services/notification.services')
const analyticsService = {
  // Sử dụng analytics service thực tế
  trackEvent: require('../services/analytics.services').trackEvent
}

// Khởi tạo subjects (observables)
const challengeSubmissionSubject = new ChallengeSubmissionSubject()
const courseCompletionSubject = new CourseCompletionSubject()
const userAchievementSubject = new UserAchievementSubject()

// Khởi tạo observers
const badgeSystemObserver = new BadgeSystemObserver(userChallengeStatsService)
const notificationObserver = new NotificationObserver(notificationService)
const analyticsObserver = new AnalyticsObserver(analyticsService)

// Đăng ký observers với subjects
function initializeObservers() {
  // Challenge submission observers
  challengeSubmissionSubject.subscribe(badgeSystemObserver)
  challengeSubmissionSubject.subscribe(notificationObserver)
  challengeSubmissionSubject.subscribe(analyticsObserver)

  // Course completion observers
  courseCompletionSubject.subscribe(badgeSystemObserver)
  courseCompletionSubject.subscribe(notificationObserver)
  courseCompletionSubject.subscribe(analyticsObserver)

  // User achievement observers
  userAchievementSubject.subscribe(notificationObserver)
  userAchievementSubject.subscribe(analyticsObserver)
  
  console.log('Observer pattern initialized successfully')
}

module.exports = {
  initializeObservers,
  subjects: {
    challengeSubmissionSubject,
    courseCompletionSubject,
    userAchievementSubject
  }
}
