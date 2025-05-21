'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const postSchema = new Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  topicId: { type: String, required: true },
  topicName: { type: String, required: true },
  votes: { type: Number, default: 0 },
  comments: [commentSchema]
}, {
  timestamps: true,
  collection: 'forumPosts'
})

const topicSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true }
}, {
  timestamps: true,
  collection: 'forumTopics'
})

exports.ForumPost = mongoose.model('ForumPost', postSchema)
exports.ForumTopic = mongoose.model('ForumTopic', topicSchema)