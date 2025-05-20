'use strict'

const CourseService = require('../services/course.services')
const { SuccessResponse, CREATED } = require('../core/success.response')

class CourseController {
  // Create a new course
  createCourse = async (req, res, next) => {
    try {
      const courseData = {
        ...req.body,
        author: req.user.userId
      }
      
      new CREATED({
        message: 'Course created successfully',
        metadata: await CourseService.createCourse(courseData)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  // Get all courses
  getAllCourses = async (req, res, next) => {
    try {
      const { limit = 50, page = 1, sort = 'ctime' } = req.query
      
      new SuccessResponse({
        message: 'Get courses successfully',
        metadata: await CourseService.getAllCourses({
          limit: parseInt(limit),
          page: parseInt(page),
          sort
        })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  // Get course by ID
  getCourseById = async (req, res, next) => {
    try {
      const { id } = req.params
      
      new SuccessResponse({
        message: 'Get course successfully',
        metadata: await CourseService.getCourseById(id)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  // Update course
  updateCourse = async (req, res, next) => {
    try {
      const { id } = req.params
      const { userId } = req.user
      
      // Check if the user is the course author
      const course = await CourseService.getCourseById(id)
      
      if (course.author._id.toString() !== userId) {
        return res.status(403).json({
          code: 'FORBIDDEN',
          status: 'error',
          message: 'You do not have permission to update this course'
        })
      }
      
      new SuccessResponse({
        message: 'Update course successfully',
        metadata: await CourseService.updateCourse(id, req.body)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  // Delete course
  deleteCourse = async (req, res, next) => {
    try {
      const { id } = req.params
      const { userId } = req.user
      
      // Check if the user is the course author
      const course = await CourseService.getCourseById(id)
      
      if (course.author._id.toString() !== userId) {
        return res.status(403).json({
          code: 'FORBIDDEN',
          status: 'error',
          message: 'You do not have permission to delete this course'
        })
      }
      
      new SuccessResponse({
        message: 'Delete course successfully',
        metadata: await CourseService.deleteCourse(id)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  // Enroll in course
  enrollCourse = async (req, res, next) => {
    try {
      const { id } = req.params
      const { userId } = req.user
      
      new SuccessResponse({
        message: 'Enrolled in course successfully',
        metadata: await CourseService.addStudent(id, userId)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  // Get students in course
  getStudentsInCourse = async (req, res, next) => {
    try {
      const { id } = req.params
      const { userId } = req.user
      
      // Check if the user is the course author
      const course = await CourseService.getCourseById(id)
      
      if (course.author._id.toString() !== userId) {
        return res.status(403).json({
          code: 'FORBIDDEN',
          status: 'error',
          message: 'You do not have permission to view students'
        })
      }
      
      new SuccessResponse({
        message: 'Get students successfully',
        metadata: await CourseService.getStudentsInCourse(id)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  // Search courses
  searchCourses = async (req, res, next) => {
    try {
      const { keyword } = req.query
      
      if (!keyword) {
        return res.status(400).json({
          code: 'BAD_REQUEST',
          status: 'error',
          message: 'Keyword is required'
        })
      }
      
      new SuccessResponse({
        message: 'Search courses successfully',
        metadata: await CourseService.searchCourses(keyword)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new CourseController()
