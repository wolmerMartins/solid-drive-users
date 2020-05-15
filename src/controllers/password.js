'use strict'

const crypto = require('crypto')

const generateHash = ({ salt, password }) => crypto
  .createHmac('sha512', salt).update(password).digest('base64')

const hashPassword = ({ password }) => {
  const salt = crypto.randomBytes(16).toString('base64')
  const hash = generateHash({ salt, password })

  return `${salt}$${hash}`
}

const verifyPassword = ({ body, user }) => {
  const { password: bodyPassword } = body
  const { password: userPassword } = user

  const [salt, passwordHash] = userPassword.split('$')
  const hash = generateHash({ salt, password: bodyPassword })

  return (passwordHash === hash)
}

exports.hashPassword = hashPassword
exports.verifyPassword = verifyPassword
