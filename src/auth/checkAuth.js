'use strict'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'Content-Type'
}

const { logger } = require('../configs/config.logger')
const { findById } = require('../services/apikey.services')

const apiKey = async (req, res, next) => {
  try {
    const apiKeyValue = req.headers[HEADER.API_KEY]?.toString()
    if (!apiKeyValue) {
      logger.warn('API Key is missing')
      return res.status(401).json({ message: 'Forbidden Error' })
    }
    const objectKey = await findById(apiKeyValue)
    if (!objectKey) {
      logger.warn('Invalid API Key provided')
      return res.status(403).json({ message: 'Forbidden Error' })
    }
    req.objKey = objectKey
    logger.info('API Key is valid', { apiKey: objectKey })
    return next()
  } catch (error) {
    return res.status(500).json({ error, message: 'Internal Server Error' })
  }
}

const permission = (permissions) => {
  return (req, res, next) => {
    if (!req?.objKey?.permissions || !req.objKey.permissions.includes(permissions)) {
      logger.warn('Permission denied')
      return res.status(403).json({ message: 'Permission denied' })
    }
    return next()
  }
}

module.exports = {
  apiKey,
  permission
}
