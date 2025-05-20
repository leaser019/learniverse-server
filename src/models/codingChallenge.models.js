'use strict'
const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'CodingChallenges'
const DOCUMENT_NAME = 'CodingChallenge'

const testCaseSchema = new Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
})

const codingChallengeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Expert'],
      required: true
    },
    categories: {
      type: [String],
      enum: ['Algorithm', 'Data Structure', 'Web Development', 'Database', 'Machine Learning', 'Frontend', 'Backend'],
      default: []
    },
    supportedLanguages: {
      type: [String],
      enum: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL'],
      required: true
    },
    defaultLanguage: {
      type: String,
      enum: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    timeLimit: {
      type: Number,
      required: true
    },
    startCode: {
      type: Map,
      of: String,
      required: true
    },
    testCases: {
      type: [testCaseSchema],
      required: true
    },
    solution: {
      type: Map,
      of: String
    },
    hints: {
      type: [String],
      default: []
    },
    dailyChallenge: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = model(DOCUMENT_NAME, codingChallengeSchema)
