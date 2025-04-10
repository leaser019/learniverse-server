const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'Users'
const DOCUMENT_NAME = 'User'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: Array,
      // enum: ['admin', 'user'],
      default: ['user']
    },
    mobile: {
      type: String,
      required: false,
      default: null
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = model(DOCUMENT_NAME, userSchema)
