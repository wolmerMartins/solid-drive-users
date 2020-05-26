'use strict'

const pino = require('../logger')

const logger = pino.child({ type: 'middleware' })

module.exports = logger
