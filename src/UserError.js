'use strict'

class UserError extends Error {
  constructor(message, code, statusCode = 422) {
    super()

    this.statusCode = statusCode
    this.message = message
    this.code = code

    Error.captureStackTrace(this, UserError)
  }
}

module.exports = UserError
