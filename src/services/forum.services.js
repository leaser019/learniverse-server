'use strict'

const { ForumPost, ForumTopic } = require('../models/forum.models')
const { v4: uuidv4 } = require('uuid')

class ForumService {
  static async createTopic(data) {
    try {
      const topicWithId = { ...data, id: data.id || uuidv4() }
      const newTopic = await ForumTopic.create(topicWithId)
      return newTopic
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getTopics({ limit = 20, page = 1 }) {
    try {
      const skip = (page - 1) * limit
      const topics = await ForumTopic.find()
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await ForumTopic.countDocuments()

      return {
        data: topics,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async createPost(data) {
    try {
      const topic = await ForumTopic.findOne({ id: data.topicId })
      if (!topic) throw new Error('Topic not found')
      
      const postWithId = { 
        ...data, 
        id: data.id || uuidv4(),
        topicName: topic.name,
        createdAt: new Date(),
        votes: 0,
        comments: []
      }
      
      const newPost = await ForumPost.create(postWithId)
      return newPost
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getPosts({ limit = 20, page = 1, topicId }) {
    try {
      const query = topicId ? { topicId } : {}
      const skip = (page - 1) * limit
      
      const posts = await ForumPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await ForumPost.countDocuments(query)

      return {
        data: posts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async addComment(postId, commentData) {
    try {
      const post = await ForumPost.findOne({ id: postId })
      if (!post) throw new Error('Post not found')
      
      const comment = {
        id: uuidv4(),
        content: commentData.content,
        author: commentData.author,
        createdAt: new Date()
      }
      
      post.comments.push(comment)
      await post.save()
      
      return comment
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = ForumService