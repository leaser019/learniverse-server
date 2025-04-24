'use strict'

const apiKeyModel = require('../models/apiKey.models')
const crypto = require('crypto')

const findById = async (key) => {
  // const newApiKey = await apiKeyModel.create({ key: crypto.randomBytes(16).toString('hex'), permissions: ['002'] })
  // console.log(newApiKey)
  const result = await apiKeyModel.findOne({ key, status: true }).lean()
  return result
}

module.exports = { findById }
