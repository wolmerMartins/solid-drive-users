'use strict'

const { DEVELOPMENT } = require('./constants')

const options = {
  messageKey: 'message'
}

if (process.env.NODE_ENV === DEVELOPMENT) {
  options.prettyPrint = {
    colorize: true,
    translateTime: true,
    ignore: 'pid,hostname'
  }
}

const pino = require('pino')(options)

const logger = pino.child({ API: 'users' })

module.exports = logger
