'use strict'

const jwt = require('jsonwebtoken')

const config = require('../config/config')

module.exports = {
  generateToken: payload => new Promise((resolve, reject) => {
    jwt.sign(payload, config.jwt.secret, {
      expiresIn: '12h'
    }, (err, encoded) => {
      if (err) reject(err)

      resolve(encoded)
    })
  })
}
