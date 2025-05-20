'use strict'

// Observer Pattern cho notification và event-based systems

// Subject interface (Observable)
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

// Observer interface
class Observer {
  update(data) {
    throw new Error('Method update() must be implemented by concrete observer');
  }
}

// Concrete Subject: course completion events
class CourseCompletionSubject extends Subject {
  courseCompleted(userId, courseId) {
    this.notify({ type: 'COURSE_COMPLETED', userId, courseId, timestamp: new Date() });
  }
}

// Concrete Subject: challenge submission events
class ChallengeSubmissionSubject extends Subject {
  submissionMade(userId, challengeId, result) {
    this.notify({ type: 'CHALLENGE_SUBMISSION', userId, challengeId, result, timestamp: new Date() });
  }

  challengeCompleted(userId, challengeId) {
    this.notify({ type: 'CHALLENGE_COMPLETED', userId, challengeId, timestamp: new Date() });
  }
}

// Concrete Subject: user achievement events
class UserAchievementSubject extends Subject {
  achievementUnlocked(userId, achievementId, achievementName) {
    this.notify({ type: 'ACHIEVEMENT_UNLOCKED', userId, achievementId, achievementName, timestamp: new Date() });
  }

  levelUp(userId, newLevel) {
    this.notify({ type: 'LEVEL_UP', userId, newLevel, timestamp: new Date() });
  }

  streakUpdated(userId, streakDays) {
    this.notify({ type: 'STREAK_UPDATED', userId, streakDays, timestamp: new Date() });
  }
}

// Concrete Observer: Badge System
class BadgeSystemObserver extends Observer {
  constructor(userChallengeStatsService) {
    super();
    this.userChallengeStatsService = userChallengeStatsService;
  }

  async update(data) {
    const { type, userId } = data;

    switch (type) {
      case 'CHALLENGE_COMPLETED':
        await this.checkChallengeBadges(userId);
        break;
      case 'COURSE_COMPLETED':
        await this.checkCourseBadges(userId);
        break;
      case 'STREAK_UPDATED':
        await this.checkStreakBadges(userId, data.streakDays);
        break;
    }
  }

  async checkChallengeBadges(userId) {
    const userStats = await this.userChallengeStatsService.findUserStatsByUserId(userId);
    if (!userStats) return;

    const badges = [];

    // First challenge completed
    if (userStats.totalSolved === 1) {
      badges.push({
        name: 'First Challenge',
        description: 'Completed your first challenge',
        iconUrl: '/badges/first-challenge.png',
        earnedAt: new Date()
      });
    }

    // 10 challenges completed
    if (userStats.totalSolved === 10) {
      badges.push({
        name: 'Challenge Master',
        description: 'Completed 10 challenges',
        iconUrl: '/badges/challenge-master.png',
        earnedAt: new Date()
      });
    }

    // First hard challenge
    if (userStats.hardSolved === 1) {
      badges.push({
        name: 'Hard Thinker',
        description: 'Completed your first hard challenge',
        iconUrl: '/badges/hard-thinker.png',
        earnedAt: new Date()
      });
    }

    if (badges.length > 0) {
      await this.userChallengeStatsService.addBadges(userId, badges);
    }
  }

  async checkCourseBadges(userId) {
    // Logic for course-related badges
  }

  async checkStreakBadges(userId, streakDays) {
    const badges = [];

    // 7-day streak
    if (streakDays === 7) {
      badges.push({
        name: 'Weekly Warrior',
        description: 'Maintained a 7-day streak',
        iconUrl: '/badges/weekly-warrior.png',
        earnedAt: new Date()
      });
    }

    // 30-day streak
    if (streakDays === 30) {
      badges.push({
        name: 'Monthly Master',
        description: 'Maintained a 30-day streak',
        iconUrl: '/badges/monthly-master.png',
        earnedAt: new Date()
      });
    }

    if (badges.length > 0) {
      await this.userChallengeStatsService.addBadges(userId, badges);
    }
  }
}

// Concrete Observer: Notification System
class NotificationObserver extends Observer {
  constructor(notificationService) {
    super();
    this.notificationService = notificationService;
  }

  async update(data) {
    const { type, userId } = data;
    let message = '';
    let title = '';

    switch (type) {
      case 'CHALLENGE_COMPLETED':
        title = 'Challenge Completed!';
        message = 'Congratulations! You have successfully completed a coding challenge.';
        break;
      case 'COURSE_COMPLETED':
        title = 'Course Completed!';
        message = 'Congratulations! You have successfully completed a course.';
        break;
      case 'ACHIEVEMENT_UNLOCKED':
        title = 'New Achievement!';
        message = `Congratulations! You have unlocked the "${data.achievementName}" achievement.`;
        break;
      case 'LEVEL_UP':
        title = 'Level Up!';
        message = `You have reached level ${data.newLevel}. Keep up the great work!`;
        break;
      case 'STREAK_UPDATED':
        if (data.streakDays % 7 === 0) { // Only notify on weekly milestone
          title = 'Streak Milestone!';
          message = `You've maintained a ${data.streakDays}-day streak. Amazing dedication!`;
        } else {
          return; // Don't notify for every day
        }
        break;
    }

    if (title && message) {
      await this.notificationService.sendNotification(userId, {
        title,
        message,
        type: 'system',
        read: false,
        createdAt: new Date()
      });
    }
  }
}

// Concrete Observer: Analytics System
class AnalyticsObserver extends Observer {
  constructor(analyticsService) {
    super();
    this.analyticsService = analyticsService;
  }

  async update(data) {
    // Track all events for analytics
    await this.analyticsService.trackEvent(data.type, {
      userId: data.userId,
      timestamp: data.timestamp,
      metadata: { ...data }
    });
  }
}

// Export classes
module.exports = {
  // Base classes
  Subject,
  Observer,
  
  // Concrete Subjects
  CourseCompletionSubject,
  ChallengeSubmissionSubject,
  UserAchievementSubject,
  
  // Concrete Observers
  BadgeSystemObserver,
  NotificationObserver,
  AnalyticsObserver
};
