'use strict'

const jwt = require('jsonwebtoken')

const config = require('../config/config')

module.exports = {
  generateToken: (payload, expiresIn) => new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn })
      resolve(token)
    } catch(err) {
      reject(err)
    }
  }),
  verifyToken: token => new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      resolve(decoded)
    } catch(err) {
      reject(err)
    }
  })
}
