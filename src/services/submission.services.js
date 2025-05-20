'use strict'
const SubmissionModel = require('../models/challengeSubmission.models')
const UserChallengeStatsModel = require('../models/userChallengeStats.models')
const ChallengeModel = require('../models/codingChallenge.models')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { ChallengeSubmissionSubject, UserAchievementSubject } = require('../patterns/observerPattern')

// Create instances of the subject classes
const submissionSubject = new ChallengeSubmissionSubject()
const achievementSubject = new UserAchievementSubject()

class SubmissionService {
  async createSubmission({
    userId,
    challengeId,
    code,
    language,
    status,
    runtime,
    memory,
    passedTestCases,
    totalTestCases
  }) {
    try {
      // Calculate score based on status and tests passed
      let score = 0
      if (status === 'Accepted') {
        // Find the challenge to get its points value
        const challenge = await ChallengeModel.findById(challengeId)
        if (!challenge) throw new NotFoundError('Challenge not found')
        
        // Full points for accepted submissions
        score = challenge.points
        
        // Bonus points for efficient solutions (lower runtime)
        if (runtime < 100) { // Less than 100ms
          score += Math.floor(challenge.points * 0.1) // 10% bonus
        }
      } else {
        // Partial points for partially correct submissions
        const challenge = await ChallengeModel.findById(challengeId)
        if (!challenge) throw new NotFoundError('Challenge not found')
        
        // Calculate partial score based on test cases passed
        score = Math.floor((passedTestCases / totalTestCases) * challenge.points * 0.5) // 50% of points max for partial solutions
      }
      
      // Create the submission record
      const submission = await SubmissionModel.create({
        userId,
        challengeId,
        code,
        language,
        status,
        runtime,
        memory,
        score,
        passedTestCases,
        totalTestCases
      })
      
      // Update user stats
      await this.updateUserStats(userId, challengeId, submission)
      
      // Notify observers about the submission
      submissionSubject.submissionMade(userId, challengeId, {
        status,
        score,
        passedTestCases,
        totalTestCases
      })
      
      if (status === 'Accepted') {
        submissionSubject.challengeCompleted(userId, challengeId)
      }
      
      return submission
    } catch (error) {
      throw new BadRequestError('Cannot create submission: ' + error.message)
    }
  }

  async updateUserStats(userId, challengeId, submission) {
    // Find or create user stats
    let userStats = await UserChallengeStatsModel.findOne({ userId })
    
    if (!userStats) {
      userStats = await UserChallengeStatsModel.create({ userId })
    }
    
    // Only update stats if this is the first accepted solution or a better solution
    if (submission.status === 'Accepted') {
      const challenge = await ChallengeModel.findById(challengeId)
      if (!challenge) return
      
      // Check if user already solved this challenge
      const previousSubmission = await SubmissionModel.findOne({
        userId,
        challengeId,
        status: 'Accepted'
      }).sort({ score: -1 }).limit(1)
      
      const isFirstSolve = !previousSubmission || 
                          (previousSubmission && previousSubmission._id.toString() === submission._id.toString())
      
      if (isFirstSolve) {
        // Update total solved count
        userStats.totalSolved += 1
        
        // Update difficulty-specific count
        switch(challenge.difficulty) {
          case 'Easy':
            userStats.easySolved += 1
            break
          case 'Medium':
            userStats.mediumSolved += 1
            break
          case 'Hard':
            userStats.hardSolved += 1
            break
          case 'Expert':
            userStats.expertSolved += 1
            break
        }
      }
      
      // Always update total points with max score
      const bestScore = Math.max(
        submission.score,
        previousSubmission ? previousSubmission.score : 0
      )
      
      // If this is a better solution, update the points difference
      if (!previousSubmission || bestScore > previousSubmission.score) {
        const scoreDiff = previousSubmission
          ? bestScore - previousSubmission.score
          : bestScore
        
        userStats.totalPoints += scoreDiff
      }
      
      // Update streak
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const lastActive = new Date(userStats.lastActiveDate)
      lastActive.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActive.getTime() === yesterday.getTime()) {
        // Increment streak if last activity was yesterday
        userStats.streakDays += 1
        achievementSubject.streakUpdated(userId, userStats.streakDays)
      } else if (lastActive.getTime() < yesterday.getTime()) {
        // Reset streak if more than a day has passed
        userStats.streakDays = 1
        achievementSubject.streakUpdated(userId, userStats.streakDays)
      }
      
      // Update last active date
      userStats.lastActiveDate = new Date()
      
      // Save the updates
      await userStats.save()
    }
  }

  async findSubmissionById(submissionId) {
    return await SubmissionModel.findById(submissionId).lean()
  }

  async findSubmissionByCondition(filter) {
    return await SubmissionModel.find(filter).lean()
  }

  async updateSubmission(submissionId, updateData) {
    const submission = await SubmissionModel.findById(submissionId)
    if (!submission) throw new NotFoundError('Submission not found')

    Object.assign(submission, updateData)
    await submission.save()
    return submission
  }

  async deleteSubmission(submissionId) {
    const result = await SubmissionModel.findByIdAndDelete(submissionId)
    if (!result) throw new NotFoundError('Submission not found')
    return { message: 'Submission deleted successfully' }
  }

  async getAllSubmissions(filter = {}, options = {}) {
    const { limit = 20, page = 1, sortBy = 'createdAt', order = 'desc' } = options
    const skip = (page - 1) * limit

    const sortOptions = {}
    sortOptions[sortBy] = order === 'desc' ? -1 : 1

    const submissions = await SubmissionModel
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await SubmissionModel.countDocuments(filter)

    return {
      data: submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getUserSubmissions(userId, challengeId = null) {
    const query = { userId }
    if (challengeId) query.challengeId = challengeId
    
    const submissions = await SubmissionModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean()
      
    return submissions
  }
  
  async getBestSubmission(userId, challengeId) {
    return await SubmissionModel
      .findOne({ userId, challengeId, status: 'Accepted' })
      .sort({ score: -1, runtime: 1 })
      .lean()
  }
}

module.exports = new SubmissionService()
