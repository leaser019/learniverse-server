'use strict'

const express = require('express')
const router = express.Router()
const ForumController = require('../../controllers/forum.controllers')

router.post('/topics', ForumController.createTopic)
router.get('/topics', ForumController.getTopics)

router.post('/posts', ForumController.createPost)
router.get('/posts', ForumController.getPosts)
router.post('/posts/:postId/comments', ForumController.addComment)

module.exports = router