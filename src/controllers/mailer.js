'use strict'

const pushpin = require('./pushpin')
const config = require('../config/config')
const { API_V1 } = require('../constants')
const { generateToken } = require('./jwt')
const mailer = require('../config/mailer')
const controllerLogger = require('./logger')

const logger = controllerLogger.child({ module: 'mailer' })

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

const sendEmail = async ({ type, options, channel }) => {
  try {
    const info = await mailer.sendEmail(options)

    logger.info({ info }, `${type} email sended successfully`)

    pushpin.publish.realtime({
      data: {
        success: true,
        message: `${type} email sended successfully`
      },
      close: true,
      channel
    })
  } catch(error) {
    logger.error({
      error,
      retry: retries
    }, `An error has occurred sending the ${type} email`)

    if (retries < 3) {
      sendEmail({ options, channel, type })
      retries++
    } else {
      pushpin.publish.realtime({
        data: { error: `An error has occurred sending the ${type} email` },
        close: true,
        channel
      })
    }
  }
}

const emailButton = ({ id, path, text, token }) => `
  <div style="width: 100%; height: 70px; text-align: center;">
    <a
      style="${buttonStyle}"
      href="${`${config.domain.url}${API_V1}/users/${id}/${path}/${token}`}"
    >
      ${text}
    </a>
  </div>
`

const getEmailOptions = ({
  path,
  text,
  token,
  subject,
  user: {
    id,
    email
  }
}) => ({
  to: email,
  subject: `${subject} a conta Solid Drive`,
  html: emailButton({
    id,
    path,
    text,
    token
  })
})

const generateEmailToken = async ({ user, channel }) => {
  const { id, email, username } = user

  return generateToken({ id, email, channel, username }, '1h')
}

const sendReenableEmail = async ({ user, channel }) => {
  const token = await generateEmailToken({ user, channel })

  const options = getEmailOptions({
    user,
    token,
    path: 'reenable',
    subject: 'Reativar',
    text: 'Reativar Conta'
  })

  sendEmail({ options, channel, type: 'reenable' })
}

const sendActivationEmail = async ({ user, channel }) => {
  const token = await generateEmailToken({ user, channel })

  const options = getEmailOptions({
    user,
    token,
    path: 'activate',
    subject: 'Ativar',
    text: 'Ativar Conta',
  })

  sendEmail({ options, channel, type: 'activate' })
}

exports.sendActivationEmail = sendActivationEmail
exports.sendReenableEmail = sendReenableEmail
