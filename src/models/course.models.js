'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lessonSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  type: { type: String, enum: ['video', 'exercise', 'project'], required: true },
  videoUrl: { type: String, require: false }
})

const moduleSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  lessons: [lessonSchema]
})

const reviewSchema = new Schema({
  id: { type: String, required: false },
  user: { type: String, required:false },
  avatar: { type: String },
  rating: { type: Number, required: false, min: 1, max: 5 },
  date: { type: String, required: false },
  content: { type: String, required: false }
})

const faqSchema = new Schema({
  question: { type: String, required: false },
  answer: { type: String, required: false }
})

const courseSchema = new Schema({
  id: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorRole: { type: String },
  bio: { type: String },
  instructorAvatarUrl: { type: String },
  thumbnailUrl: { type: String },
  videoUrl: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  duration: { type: String },
  level: { type: String },
  enrollmentCount: { type: Number, default: 0 },
  language: { type: String },
  lastUpdate: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  originalPrice: { type: Number },
  isPopular: { type: Boolean, default: false },
  previewAvailable: { type: Boolean, default: false },
  categories: [String],
  tags: [String],
  skills: [String],
  requirements: [String],
  whatYouWillLearn: [String],
  modules: [moduleSchema],
  reviews: [reviewSchema],
  faq: [faqSchema],
  relatedCourseIds: [String]
}, {
  timestamps: true,
  collection: 'courses'
})

module.exports = mongoose.model('Course', courseSchema)