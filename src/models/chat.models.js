'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatGroupSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'chatGroups'
})

const chatMessageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  groupId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'chatMessages'
})

exports.ChatGroup = mongoose.model('ChatGroup', chatGroupSchema)
exports.ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)