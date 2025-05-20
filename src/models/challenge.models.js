'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DOCUMENT_NAME = 'CodingChallenge'
const COLLECTION_NAME = 'CodingChallenges'

const codingChallengeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    default: 'Medium'
  },
  categories: {
    type: [String],
    required: true
  },
  supportedLanguages: {
    type: [String],
    required: true
  },
  defaultLanguage: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  timeLimit: {
    type: Number,
    min: 0,
    default: 30
  },
  startCode: {
    type: Map,
    of: String,
    required: true
  },
  testCases: [{
    input: Schema.Types.Mixed,
    output: Schema.Types.Mixed,
    hidden: {
      type: Boolean,
      default: false
    }
  }],
  solution: {
    type: Map,
    of: String
  },
  hints: [String],
  dailyChallenge: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = mongoose.model(DOCUMENT_NAME, codingChallengeSchema)