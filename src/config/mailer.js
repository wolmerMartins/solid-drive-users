'use strict'

const nodemailer = require('nodemailer')

const setup = ({
  host,
  user,
  port,
  ciphers,
  password,
  secureConnection
}) => {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secureConnection,
    tls: { ciphers },
    auth: {
      user: user,
      pass: password
    }
  })

  module.exports.sendEmail = options => new Promise((resolve, reject) => {
    transporter.sendMail({
      ...options,
      from: user
    }, (err, info) => {
      if (err) return reject(err)

      resolve(info)
    })
  })
}

module.exports = setup
