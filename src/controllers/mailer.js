'use strict'

const pushpin = require('./pushpin')
const { URL } = require('../constants')
const { generateToken } = require('./jwt')
const mailer = require('../config/mailer')
const controllerLogger = require('./logger')

const logger = controllerLogger.child({ module: 'utils' })

let retries = 0

const buttonStyle = `
  text-decoration: none;
  border: 1px solid #000;
  border-radius: 5px;
  text-align: center;
  line-height: 15px;
  height: 30px;
  color: #000;
  padding: 10px 20px;
  margin-top: 20px;
`

const sendEmail = async ({ options, channel }) => {
  try {
    const info = await mailer.sendEmail(options)

    logger.info({ info }, 'Activation email sended successfully')

    pushpin.publish.realtime({
      data: {
        success: true,
        message: 'Activation email sended successfully'
      },
      close: true,
      channel
    })
  } catch(error) {
    logger.error({
      error,
      retry: retries
    }, 'An error has occurred sending the activation email')

    if (retries < 3) {
      sendEmail({ options, channel })
      retries++
    } else {
      pushpin.publish.realtime({
        data: { error: 'An error has occurred sending the activation email' },
        close: true,
        channel
      })
    }
  }
}

const activateButton = ({ id, token }) => `
  <div style="width: 100%; height: 70px; text-align: center;">
    <a
      style="${buttonStyle}"
      href="${`${URL}/users/${id}/activate/${token}`}"
    >
      Activate Account
    </a>
  </div>
`

const sendActivationEmail = async ({ user, channel }) => {
  const { id, email, username } = user

  const token = await generateToken({ id, email, channel, username }, '1h')

  const options = {
    to: email,
    subject: 'Activate Solid Drive account',
    html: activateButton({ id, token })
  }

  sendEmail({ options, channel })
}

exports.sendActivationEmail = sendActivationEmail
