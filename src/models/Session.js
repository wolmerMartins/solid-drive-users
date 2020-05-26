'use strict'

const setup = client => {
  module.exports.initUserSession = (key, value) => new Promise((resolve, reject) => {
    client.set(key, value, (err, result) => {
      if (err) return reject(err)

      client.expire(key, 43200)

      resolve(result)
    })
  })

  module.exports.getUserSessionToken = (key) => new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) return reject(err)

      resolve(reply)
    })
  })
}

module.exports = setup