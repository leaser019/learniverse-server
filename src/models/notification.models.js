'use strict'
const mongoose = require('mongoose')

const COLLECTION_NAME = 'Notifications'
const DOCUMENT_NAME = 'Notification'

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['system', 'achievement', 'course', 'challenge', 'social'],
      default: 'system'
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema)
