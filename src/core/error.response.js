'use strict'

const httpStatusCode = require('../utils/httpStatusCode')
const STATUSCODE = httpStatusCode.StatusCode
const REASONSTATUSCODE = httpStatusCode.ReasonPhase

class ErrorResponse extends Error {
  constructor(message = 'error', statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = REASONSTATUSCODE.CONFLICT, statusCode = STATUSCODE.CONFLICT) {
    super(message, statusCode)
  }
}
class NotFoundRequestError extends ErrorResponse {
  constructor(message = REASONSTATUSCODE.NOT_FOUND, statusCode = STATUSCODE.NOT_FOUND) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = REASONSTATUSCODE.BAD_REQUEST, statusCode = STATUSCODE.BAD_REQUEST) {
    super(message, statusCode)
  }
}
class ForbiddenRequestError extends ErrorResponse {
  constructor(message = REASONSTATUSCODE.FORBIDDEN, statusCode = STATUSCODE.FORBIDDEN) {
    super(message, statusCode)
  }
}
class UnauthorizedRequestError extends ErrorResponse {
  constructor(message = REASONSTATUSCODE.UNAUTHORIZED, statusCode = STATUSCODE.UNAUTHORIZED) {
    super(message, statusCode)
  }
}
class InternalServerError extends ErrorResponse {
  constructor(message = REASONSTATUSCODE.INTERNAL_SERVER_ERROR, statusCode = STATUSCODE.INTERNAL_SERVER_ERROR) {
    super(message, statusCode)
  }
}

class TimeoutRequestError extends ErrorResponse {
  constructor(message = REASONSTATUSCODE.TIMEOUT, statusCode = STATUSCODE.INTERNAL_SERVER_ERROR) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  NotFoundRequestError,
  InternalServerError,
  TimeoutRequestError,
  BadRequestError,
  ForbiddenRequestError,
  UnauthorizedRequestError
}
