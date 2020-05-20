'use strict'

const redis = require('redis')

const configLogger = require('./logger')
const session = require('../models/Session')

const logger = configLogger.child({ module: 'redis' })

const setup = ({ db, host, port }) => {
  const client = redis.createClient({
    db,
    host,
    port,
    prefix: 'sd:session:user:'
  })

  client.on('connect', () => {
    logger.info('Redis client connected successfully')
    session(client)
  })

  client.on('error', error => {
    logger.error({ error }, 'An error has occurred trying to connect Redis client')
  })
}

module.exports = setup
