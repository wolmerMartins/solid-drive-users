'use strict'

const server = require('./config/server')
const config = require('./config/config')
const routes = require('./router')

server.use(routes)

server.listen(config.app.port, () => {
  console.log(`API listens at the port ${config.app.port}`)
})
