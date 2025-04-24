'use strict'

const httpStatusCode = require('../utils/httpStatusCode')
const STATUSCODE = httpStatusCode.StatusCode
const REASONSTATUSCODE = httpStatusCode.ReasonPhase

class SuccessResponse {
  constructor({
    message = 'success',
    statusCode = STATUSCODE.OK,
    reasonStatusCode = REASONSTATUSCODE.OK,
    metadata = {}
  }) {
    this.status = message
    this.code = statusCode
    this.message = reasonStatusCode
    this.metadata = metadata
  }
  send(res, headers = {}) {
    res.set(headers).status(this.code).json(this)
  }
}

class OK extends SuccessResponse {
  constructor(message = REASONSTATUSCODE.OK, metadata = {}) {
    super(message, metadata)
  }
}
class CREATED extends SuccessResponse {
  constructor(
    options = {},
    message = 'success',
    statusCode = STATUSCODE.CREATED,
    reasonStatusCode = REASONSTATUSCODE.CREATED,
    metadata = {}
  ) {
    super(message, statusCode, reasonStatusCode, metadata)
    this.options = options
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse
}
