'use strict'

const express = require('express')
const router = express.Router()
const ChatController = require('../../controllers/chat.controllers')

// Group routes
router.post('/groups', ChatController.createGroup)
router.get('/groups', ChatController.getGroups)
router.get('/groups/:id', ChatController.getGroupById)
router.put('/groups/:id', ChatController.updateGroup)
router.delete('/groups/:id', ChatController.deleteGroup)

// Message routes
router.post('/messages', ChatController.createMessage)
router.get('/messages', ChatController.getMessages)
router.put('/messages/:id', ChatController.updateMessage)
router.delete('/messages/:id', ChatController.deleteMessage)

module.exports = router