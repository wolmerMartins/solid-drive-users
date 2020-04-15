'use strict'

const server = require('./config/server')

const routes = require('./router')

server.use(routes)

server.listen(3000, () => {
  console.log('API listens at the port 3000')
})
