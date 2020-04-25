'use strict'

const database = require('./config/database')
const server = require('./config/server')
const config = require('./config/config')
const routes = require('./router')

database(config.db)

server.use(routes)

server.listen(config.app.port, () => {
  console.log(`API listens at the port ${config.app.port}`)
})
