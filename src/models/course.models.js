const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'Courses'
const DOCUMENT_NAME = 'Course'

const courseSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    instructor: {
      type: String,
      required: true
    },
    instructorRole: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null
    },
    instructorAvatarUrl: {
      type: String,
      default: null
    },
    thumbnailUrl: {
      type: String,
      default: null
    },
    videoUrl: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    duration: {
      type: String,
      required: true
    },
    level: {
      type: String,
      default: 'All Levels'
    },
    enrollmentCount: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'Tiếng Việt'
    },
    lastUpdate: {
      type: String,
      default: null
    },
    price: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    previewAvailable: {
      type: Boolean,
      default: false
    },
    categories: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    whatYouWillLearn: {
      type: [String],
      default: []
    },
    modules: {
      type: [
        {
          id: String,
          title: String,
          duration: String,
          lessons: [
            {
              id: String,
              title: String,
              duration: String,
              isFree: Boolean,
              type: String,
              videoUrl: String
            }
          ]
        }
      ],
      default: []
    },
    reviews: {
      type: [
        {
          id: String,
          user: String,
          avatar: String,
          rating: Number,
          date: String,
          content: String
        }
      ],
      default: []
    },
    faq: {
      type: [
        {
          question: String,
          answer: String
        }
      ],
      default: []
    },
    relatedCourseIds: {
      type: [String],
      default: []
    },
    students: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: []
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = model(DOCUMENT_NAME, courseSchema)
