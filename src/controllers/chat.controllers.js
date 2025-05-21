'use strict'

const ChatService = require('../services/chat.services')

class ChatController {
  // ===== GROUP CONTROLLERS =====
  static async createGroup(req, res) {
    try {
      const data = req.body
      const group = await ChatService.createGroup(data)
      return res.status(201).json(group)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getGroups(req, res) {
    try {
      const { limit, page } = req.query
      const groups = await ChatService.getGroups({
        limit: parseInt(limit) || 20,
        page: parseInt(page) || 1
      })
      return res.status(200).json(groups)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getGroupById(req, res) {
    try {
      const { id } = req.params
      const group = await ChatService.getGroupById(id)
      return res.status(200).json(group)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  static async updateGroup(req, res) {
    try {
      const { id } = req.params
      const updateData = req.body
      const updated = await ChatService.updateGroup(id, updateData)
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async deleteGroup(req, res) {
    try {
      const { id } = req.params
      const result = await ChatService.deleteGroup(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  // ===== MESSAGE CONTROLLERS =====
  static async createMessage(req, res) {
    try {
      const data = req.body
      const message = await ChatService.createMessage(data)
      return res.status(201).json(message)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getMessages(req, res) {
    try {
      const { groupId, limit, page } = req.query
      const messages = await ChatService.getMessages({
        groupId,
        limit: parseInt(limit) || 50,
        page: parseInt(page) || 1
      })
      return res.status(200).json(messages)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async updateMessage(req, res) {
    try {
      const { id } = req.params
      const updateData = req.body
      const updated = await ChatService.updateMessage(id, updateData)
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async deleteMessage(req, res) {
    try {
      const { id } = req.params
      const result = await ChatService.deleteMessage(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

module.exports = ChatController