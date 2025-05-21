'use strict'

const ForumService = require('../services/forum.services')

class ForumController {
  static async createTopic(req, res) {
    try {
      const data = req.body
      const topic = await ForumService.createTopic(data)
      return res.status(201).json(topic)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getTopics(req, res) {
    try {
      const { limit, page } = req.query
      const topics = await ForumService.getTopics({
        limit: parseInt(limit) || 20,
        page: parseInt(page) || 1
      })
      return res.status(200).json(topics)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async createPost(req, res) {
    try {
      const data = req.body
      const post = await ForumService.createPost(data)
      return res.status(201).json(post)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getPosts(req, res) {
    try {
      const { limit, page, topicId } = req.query
      const posts = await ForumService.getPosts({
        limit: parseInt(limit) || 20,
        page: parseInt(page) || 1,
        topicId
      })
      return res.status(200).json(posts)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async addComment(req, res) {
    try {
      const { postId } = req.params
      const commentData = req.body
      
      const comment = await ForumService.addComment(postId, commentData)
      return res.status(201).json(comment)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

module.exports = ForumController