'use strict'

const config = {
  app: {
    port: 3000
  },
  pushpin: {
    publishUrl: 'http://pushpin:5561/publish'
  },
  db: {
    database: 'solid_drive',
    user: 'solid',
    password: 'solid',
    host: 'db',
    dialect: 'mysql'
  }
}

module.exports = config
