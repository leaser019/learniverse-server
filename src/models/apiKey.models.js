const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['000', '001', '002'],
      default: ['001']
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

const ApiKey = model(DOCUMENT_NAME, apiKeySchema)
module.exports = ApiKey
