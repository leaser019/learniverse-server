'use strict'
const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'UserChallengeStats'
const DOCUMENT_NAME = 'UserChallengeStats'

const userChallengeStatsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    totalSolved: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    },
    expertSolved: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    streakDays: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    badges: {
      type: [{
        name: String,
        description: String,
        iconUrl: String,
        earnedAt: Date
      }],
      default: []
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = model(DOCUMENT_NAME, userChallengeStatsSchema)
