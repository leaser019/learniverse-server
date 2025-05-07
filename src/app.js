'use strict'
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const { requestLogger } = require('./configs/config.logger')
const { checkOverload } = require('./helpers/check.connection')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())
app.use(requestLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:3000', '']
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('CORS Error!'))
      }
    },
    credentials: true
  })
)

// Database
require('./dbs/init.mongodb')
checkOverload()

// Routes
app.use('/', require('./router'))

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const codeStatus = error.status || 500
  return res.status(codeStatus).json({
    status: 'error',
    code: codeStatus,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  })
})

module.exports = app
