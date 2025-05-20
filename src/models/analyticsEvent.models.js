'use strict'
const mongoose = require('mongoose')

const COLLECTION_NAME = 'Analytics'
const DOCUMENT_NAME = 'AnalyticsEvent'

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

// Đánh index cho các trường thường được query
analyticsEventSchema.index({ eventType: 1, timestamp: -1 })
analyticsEventSchema.index({ userId: 1, eventType: 1, timestamp: -1 })

module.exports = mongoose.model(DOCUMENT_NAME, analyticsEventSchema)
