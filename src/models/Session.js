'use strict'

const {
  MESSAGES,
  UNLOGGED_IN_CODE
} = require('../constants')

const setup = client => {
  module.exports.initUserSession = (key, value) => new Promise((resolve, reject) => {
    client.set(key, value, (err, result) => {
      if (err) return reject(err)

      client.expire(key, 43200)

      resolve(result)
    })
  })

  module.exports.getUserSessionToken = key => new Promise((resolve, reject) => {
    client.get(key, (err, session) => {
      if (err) return reject(err)
      if (!session) return reject(new Error(MESSAGES[UNLOGGED_IN_CODE]))

      resolve(session)
    })
  })

  module.exports.endUserSession = async key => new Promise((resolve, reject) => {
    client.del(key, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

module.exports = setup
