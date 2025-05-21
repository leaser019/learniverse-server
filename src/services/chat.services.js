'use strict'

const { ChatGroup, ChatMessage } = require('../models/chat.models')
const { v4: uuidv4 } = require('uuid')

class ChatService {
  // ===== GROUP OPERATIONS =====
  static async createGroup(data) {
    try {
      const groupWithId = { 
        ...data, 
        id: data.id || uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const newGroup = await ChatGroup.create(groupWithId)
      return newGroup
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getGroups({ limit = 20, page = 1 }) {
    try {
      const skip = (page - 1) * limit
      const groups = await ChatGroup.find()
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await ChatGroup.countDocuments()

      return {
        data: groups,
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

  static async getGroupById(id) {
    try {
      const group = await ChatGroup.findOne({ id }).lean()
      if (!group) throw new Error('Group not found')
      return group
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateGroup(id, updateData) {
    try {
      updateData.updatedAt = new Date()
      const updated = await ChatGroup.findOneAndUpdate(
        { id },
        updateData,
        { new: true }
      )
      if (!updated) throw new Error('Group not found')
      return updated
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteGroup(id) {
    try {
      const deleted = await ChatGroup.findOneAndDelete({ id })
      if (!deleted) throw new Error('Group not found')
      await ChatMessage.deleteMany({ groupId: id })
      return { success: true, message: 'Group deleted successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // ===== MESSAGE OPERATIONS =====
  static async createMessage(data) {
    try {
      const group = await ChatGroup.findOne({ id: data.groupId })
      if (!group) throw new Error('Group not found')
      
      const messageWithId = { 
        ...data, 
        id: data.id || uuidv4(),
        createdAt: new Date()
      }
      
      const newMessage = await ChatMessage.create(messageWithId)
      return newMessage
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getMessages({ groupId, limit = 50, page = 1 }) {
    try {
      const query = groupId ? { groupId } : {}
      const skip = (page - 1) * limit
      
      const messages = await ChatMessage.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await ChatMessage.countDocuments(query)

      return {
        data: messages,
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

  static async updateMessage(id, updateData) {
    try {
      updateData.updatedAt = new Date()
      const updated = await ChatMessage.findOneAndUpdate(
        { id },
        updateData,
        { new: true }
      )
      if (!updated) throw new Error('Message not found')
      return updated
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteMessage(id) {
    try {
      const deleted = await ChatMessage.findOneAndDelete({ id })
      if (!deleted) throw new Error('Message not found')
      return { success: true, message: 'Message deleted successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = ChatService