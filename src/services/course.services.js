'use strict'

const CourseModel = require('../models/course.models')
const { BadRequestError, NotFoundRequestError } = require('../core/error.response')
const { getInfoData } = require('../utils')

class CourseObserver {
  constructor() {
    this.observers = []
  }

  subscribe(observer) {
    this.observers.push(observer)
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer)
  }

  notify(event, data) {
    this.observers.forEach(observer => {
      observer.update(event, data)
    })
  }
}

class CourseFactory {
  static createCourse({
    courseId,
    slug,
    title,
    description,
    instructor,
    instructorRole,
    bio,
    instructorAvatarUrl,
    thumbnailUrl,
    videoUrl,
    duration,
    level,
    language,
    price,
    discount,
    originalPrice,
    categories,
    tags,
    skills,
    requirements,
    whatYouWillLearn,
    modules,
    faq,
    relatedCourseIds
  }) {
    return new CourseModel({
      courseId,
      slug,
      title,
      description,
      instructor,
      instructorRole,
      bio,
      instructorAvatarUrl,
      thumbnailUrl,
      videoUrl,
      duration,
      level,
      language,
      price,
      discount,
      originalPrice,
      categories,
      tags,
      skills,
      requirements,
      whatYouWillLearn,
      modules,
      faq,
      relatedCourseIds
    })
  }
}

class CourseService {
  constructor() {
    this.observer = new CourseObserver()
  }

  async createCourse(courseData) {
    const newCourse = CourseFactory.createCourse(courseData)
    const savedCourse = await newCourse.save()
    
    if (!savedCourse) {
      throw new BadRequestError('Cannot create course')
    }
    
    this.observer.notify('course_created', savedCourse) 
    return savedCourse
  }

  async getAllCourses({ limit = 50, page = 1, sort = 'createdAt', filter = { isPublished: true } }) {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { createdAt: -1 } : { createdAt: 1 }
    const courses = await CourseModel.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await CourseModel.countDocuments(filter)
    
    return {
      data: courses,
      total,
      page,
      limit
    }
  }

  async getCourseById(id) {
    const course = await CourseModel.findById(id)
      .populate('students', 'username email')
      .lean()
    
    if (!course) {
      throw new NotFoundRequestError('Course not found')
    }
    
    return course
  }

  async updateCourse(id, updateData) {
    const course = await CourseModel.findById(id)
    
    if (!course) {
      throw new NotFoundRequestError('Course not found')
    }
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, updateData,{ new: true })  
    this.observer.notify('course_updated', updatedCourse)
    
    return updatedCourse
  }

  async deleteCourse(id) {
    const course = await CourseModel.findById(id)
    
    if (!course) {
      throw new NotFoundRequestError('Course not found')
    }
    
    const result = await CourseModel.findByIdAndDelete(id)
    
    this.observer.notify('course_deleted', course)
    
    return result
  }

  async addStudent(courseId, studentId) {
    const course = await CourseModel.findById(courseId)
    
    if (!course) {
      throw new NotFoundRequestError('Course not found')
    }
    
    if (course.students.includes(studentId)) {
      throw new BadRequestError('Student already enrolled')
    }
    
    course.students.push(studentId)
    course.enrollmentCount += 1
    await course.save()
    
    this.observer.notify('student_added', { courseId, studentId })
    
    return course
  }

  async getStudentsInCourse(courseId) {
    const course = await CourseModel.findById(courseId)
      .populate('students', 'username email')
      .lean()
    
    if (!course) {
      throw new NotFoundRequestError('Course not found')
    }
    
    return course.students
  }

  async searchCourses(keyword) {
    const regex = new RegExp(keyword, 'i')
    
    const courses = await CourseModel.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { instructor: { $regex: regex } },
        { categories: { $in: [regex] } },
        { tags: { $in: [regex] } },
        { skills: { $in: [regex] } }
      ]
    }).lean()
    
    return courses
  }
}

const courseServiceInstance = new CourseService()

module.exports = courseServiceInstance