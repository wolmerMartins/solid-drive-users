'use strict'

const pino = require('../logger')

const logger = pino.child({ type: 'controller' })

module.exports = logger
