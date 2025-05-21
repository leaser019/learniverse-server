'use strict'

const express = require('express')
const courseController = require('../../controllers/course.controllers')

const router = express.Router()

// Public routes
router.get('/', courseController.getCourses)
router.get('/:id', courseController.getCourseById)
router.get('/slug/:slug', courseController.getCourseBySlug)

router.post('/', courseController.createCourse)
router.put('/:id', courseController.updateCourse)
router.delete('/:id', courseController.deleteCourse)

module.exports = router