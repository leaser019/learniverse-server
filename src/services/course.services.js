'use strict'

const Course = require('../models/course.models')
const { logger } = require('../configs/config.logger')

class CourseService {
  static async createCourse(courseData) {
    try {
      const newCourse = await Course.create(courseData)
      return newCourse
    } catch (error) {
      logger.error('Error creating course:', error)
      throw error
    }
  }

  static async getAllCourses(filter = {}, limit = 20, page = 1, sort = { updatedAt: -1 }) {
    const skip = (page - 1) * limit
    try {
      const courses = await Course.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
      
      const total = await Course.countDocuments(filter)
      
      return {
        courses,
        pagination: {
          total,
          limit,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      logger.error('Error fetching courses:', error)
      throw error
    }
  }

  static async getCourseById(courseId) {
    try {
      return await Course.findOne({ id: courseId }).lean()
    } catch (error) {
      logger.error(`Error fetching course by ID ${courseId}:`, error)
      throw error
    }
  }

  static async getCourseBySlug(slug) {
    try {
      return await Course.findOne({ slug }).lean()
    } catch (error) {
      logger.error(`Error fetching course by slug ${slug}:`, error)
      throw error
    }
  }

  static async updateCourse(courseId, updateData) {
    try {
      const updated = await Course.findOneAndUpdate(
        { id: courseId },
        updateData,
        { new: true }
      ).lean()
      
      if (!updated) {
        throw new Error(`Course with ID ${courseId} not found`)
      }
      
      return updated
    } catch (error) {
      logger.error(`Error updating course ${courseId}:`, error)
      throw error
    }
  }

  static async deleteCourse(courseId) {
    try {
      const result = await Course.findOneAndDelete({ id: courseId })
      if (!result) {
        throw new Error(`Course with ID ${courseId} not found`)
      }
      return { success: true, message: 'Course deleted successfully' }
    } catch (error) {
      logger.error(`Error deleting course ${courseId}:`, error)
      throw error
    }
  }
}

module.exports = CourseService