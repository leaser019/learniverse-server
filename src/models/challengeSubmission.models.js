'use strict'
const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'ChallengeSubmissions'
const DOCUMENT_NAME = 'ChallengeSubmission'

const challengeSubmissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: 'CodingChallenge',
      required: true
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      enum: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL'],
      required: true
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
      required: true
    },
    runtime: {
      type: Number,
      required: true
    },
    memory: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    passedTestCases: {
      type: Number,
      required: true
    },
    totalTestCases: {
      type: Number,
      required: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = model(DOCUMENT_NAME, challengeSubmissionSchema)
