'use strict'

const pino = require('../logger')

const logger = pino.child({ type: 'config' })

module.exports = logger
