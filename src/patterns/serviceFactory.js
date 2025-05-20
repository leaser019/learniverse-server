'use strict'

// Factory Pattern cho việc tạo các loại Service
// Định nghĩa interface chung cho tất cả service
class ServiceInterface {
  async create(data) {}
  async findById(id) {}
  async findByCondition(condition) {}
  async update(id, data) {}
  async delete(id) {}
  async list(filter, options) {}
}

// Concrete Factory cho việc tạo các Service
class ServiceFactory {
  static getService(serviceName) {
    switch(serviceName) {
      case 'user':
        return new UserServiceAdapter();
      case 'course':
        return new CourseServiceAdapter();
      case 'challenge':
        return new ChallengeServiceAdapter();
      case 'submission':
        return new SubmissionServiceAdapter();
      case 'stats':
        return new UserChallengeStatsServiceAdapter();
      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  }
}

// Adapter cho các Service hiện có
class UserServiceAdapter extends ServiceInterface {
  constructor() {
    super();
    this.userService = require('../services/user.services');
  }

  async create(data) {
    return await this.userService.createUser(data);
  }

  async findById(id) {
    return await this.userService.findUserById(id);
  }

  async findByCondition(condition) {
    return await this.userService.findUserByEmail(condition.email);
  }

  async update(id, data) {
    return await this.userService.updateUserProfile(id, data);
  }

  async delete(id) {
    return await this.userService.deleteUser(id);
  }

  async list(filter = {}, options = {}) {
    return await this.userService.getAllUsers(filter, options);
  }
}

class CourseServiceAdapter extends ServiceInterface {
  constructor() {
    super();
    this.courseService = require('../services/course.services');
  }

  async create(data) {
    return await this.courseService.createCourse(data);
  }

  async findById(id) {
    return await this.courseService.findCourseById(id);
  }

  async findByCondition(condition) {
    return await this.courseService.findCourseByCondition(condition);
  }

  async update(id, data) {
    return await this.courseService.updateCourse(id, data);
  }

  async delete(id) {
    return await this.courseService.deleteCourse(id);
  }

  async list(filter = {}, options = {}) {
    return await this.courseService.getAllCourses(filter, options);
  }
}

class ChallengeServiceAdapter extends ServiceInterface {
  constructor() {
    super();
    this.challengeService = require('../services/challenge.services');
  }

  async create(data) {
    return await this.challengeService.createChallenge(data);
  }

  async findById(id) {
    return await this.challengeService.findChallengeById(id);
  }

  async findByCondition(condition) {
    return await this.challengeService.findChallengeByCondition(condition);
  }

  async update(id, data) {
    return await this.challengeService.updateChallenge(id, data);
  }

  async delete(id) {
    return await this.challengeService.deleteChallenge(id);
  }

  async list(filter = {}, options = {}) {
    return await this.challengeService.getAllChallenges(filter, options);
  }
}

class SubmissionServiceAdapter extends ServiceInterface {
  constructor() {
    super();
    this.submissionService = require('../services/submission.services');
  }

  async create(data) {
    return await this.submissionService.createSubmission(data);
  }

  async findById(id) {
    return await this.submissionService.findSubmissionById(id);
  }

  async findByCondition(condition) {
    return await this.submissionService.findSubmissionByCondition(condition);
  }

  async update(id, data) {
    return await this.submissionService.updateSubmission(id, data);
  }

  async delete(id) {
    return await this.submissionService.deleteSubmission(id);
  }

  async list(filter = {}, options = {}) {
    return await this.submissionService.getAllSubmissions(filter, options);
  }
}

class UserChallengeStatsServiceAdapter extends ServiceInterface {
  constructor() {
    super();
    this.statsService = require('../services/userChallengeStats.services');
  }

  async create(data) {
    return await this.statsService.createUserStats(data);
  }

  async findById(id) {
    return await this.statsService.findUserStatsById(id);
  }

  async findByCondition(condition) {
    return await this.statsService.findUserStatsByUserId(condition.userId);
  }

  async update(id, data) {
    return await this.statsService.updateUserStats(id, data);
  }

  async delete(id) {
    return await this.statsService.deleteUserStats(id);
  }

  async list(filter = {}, options = {}) {
    return await this.statsService.getLeaderboard(filter, options);
  }
}

module.exports = ServiceFactory;
