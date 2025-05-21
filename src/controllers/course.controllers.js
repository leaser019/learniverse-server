'use strict'

const CourseService = require('../services/course.services')
const { logger } = require('../configs/config.logger')

class CourseController {
  static async createCourse(req, res) {
    try {
      const courseData = req.body
      const result = await CourseService.createCourse(courseData)
      
      return res.status(201).json({
        success: true,
        data: result
      })
    } catch (error) {
      logger.error('Create course error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      })
    }
  }

  static async getCourses(req, res) {
    try {
      const { limit, page, sort, ...filter } = req.query
      const result = await CourseService.getAllCourses(
        filter,
        parseInt(limit) || 20,
        parseInt(page) || 1,
        sort ? JSON.parse(sort) : { updatedAt: -1 }
      )
      
      return res.status(200).json({
        success: true,
        data: result.courses,
        pagination: result.pagination
      })
    } catch (error) {
      logger.error('Get courses error:', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      })
    }
  }

  static async getCourseById(req, res) {
    try {
      const { id } = req.params
      const course = await CourseService.getCourseById(id)
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course with ID ${id} not found`
        })
      }
      
      return res.status(200).json({
        success: true,
        data: course
      })
    } catch (error) {
      logger.error(`Get course by ID error:`, error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      })
    }
  }

  static async getCourseBySlug(req, res) {
    try {
      const { slug } = req.params
      const course = await CourseService.getCourseBySlug(slug)
      
      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course with slug "${slug}" not found`
        })
      }
      
      return res.status(200).json({
        success: true,
        data: course
      })
    } catch (error) {
      logger.error(`Get course by slug error:`, error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      })
    }
  }

  static async updateCourse(req, res) {
    try {
      const { id } = req.params
      const updateData = req.body
      
      const result = await CourseService.updateCourse(id, updateData)
      
      return res.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      logger.error(`Update course error:`, error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        })
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      })
    }
  }

  static async deleteCourse(req, res) {
    try {
      const { id } = req.params
      const result = await CourseService.deleteCourse(id)
      
      return res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      })
    } catch (error) {
      logger.error(`Delete course error:`, error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        })
      }
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      })
    }
  }
}

module.exports = CourseController