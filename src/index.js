'use strict'

const database = require('./config/database')
const server = require('./config/server')
const config = require('./config/config')
const mailer = require('./config/mailer')
const redis = require('./config/redis')
const routes = require('./router')
const logger = require('./logger')

database(config.db)
redis(config.redis)
mailer(config.email)

server.use(routes)

server.listen(config.app.port, () => {
  logger.info(`API listens at the port ${config.app.port}`)
})
