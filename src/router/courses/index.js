'use strict'

const express = require('express')
const router = express.Router()
const CourseController = require('../../controllers/course.controllers')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

// Public routes
router.get('/', asyncHandler(CourseController.getAllCourses))
router.get('/search', asyncHandler(CourseController.searchCourses))
router.get('/:id', asyncHandler(CourseController.getCourseById))

// Protected routes
router.use(authentication)
router.post('/', asyncHandler(CourseController.createCourse))
router.patch('/:id', asyncHandler(CourseController.updateCourse))
router.delete('/:id', asyncHandler(CourseController.deleteCourse))
router.post('/:id/enroll', asyncHandler(CourseController.enrollCourse))
router.get('/:id/students', asyncHandler(CourseController.getStudentsInCourse))

module.exports = router
