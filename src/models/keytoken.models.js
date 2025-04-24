const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'Keytokens'
const DOCUMENT_NAME = 'Keytoken'

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    refreshTokensUsed: {
      type: Array,
      default: []
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)
const KeyToken = model(DOCUMENT_NAME, keyTokenSchema)
module.exports = KeyToken
