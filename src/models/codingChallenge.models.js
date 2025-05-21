'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testCaseSchema = new Schema({
  input: { type: String, required: true },
  output: { type: String, required: true }
})

const codingChallengeSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Expert'], required: true },
  categories: [String],
  supportedLanguages: [String],
  defaultLanguage: { type: String, required: true },
  points: { type: Number, required: true },
  timeLimit: { type: Number, required: true },
  startCode: { type: Map, of: String },
  testCases: [testCaseSchema],
  hints: [String],
  createdAt: { type: Date, default: Date.now },
  dailyChallenge: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'codingChallenges'
})

const badgeSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String, required: true },
  earnedAt: { type: Date, required: true }
})

const leaderboardSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatarUrl: { type: String },
  totalPoints: { type: Number, default: 0 },
  rank: { type: Number },
  totalSolved: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  badges: [badgeSchema]
}, {
  timestamps: true,
  collection: 'leaderboard'
})

const submissionSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  challengeId: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'], required: true },
  runtime: { type: Number },
  memory: { type: Number },
  score: { type: Number },
  submittedAt: { type: Date, default: Date.now },
  passedTestCases: { type: Number, default: 0 },
  totalTestCases: { type: Number, required: true }
})

const userChallengeStatsSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  totalSolved: { type: Number, default: 0 },
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },
  expertSolved: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  submissions: [submissionSchema]
}, {
  timestamps: true,
  collection: 'userChallengeStats'
})

exports.CodingChallenge = mongoose.model('CodingChallenge', codingChallengeSchema)
exports.Leaderboard = mongoose.model('Leaderboard', leaderboardSchema)
exports.UserChallengeStats = mongoose.model('UserChallengeStats', userChallengeStatsSchema)