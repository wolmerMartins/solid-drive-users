'use strict'

const pino = require('../logger')

const logger = pino.child({ type: 'router' })

module.exports = logger
