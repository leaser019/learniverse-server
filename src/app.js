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
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://learniverse-client.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    credentials: true
  })
)
app.use(morgan('dev'))
app.use(compression())
app.use(requestLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.sendStatus(204)
})

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
