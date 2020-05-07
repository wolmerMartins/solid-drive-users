'use strict'

const options = {
  messageKey: 'message'
}

const pino = require('pino')(options)

const logger = pino.child({ API: 'users' })

module.exports = logger
