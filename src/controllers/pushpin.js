'use strict'

const axios = require('axios')

const config = require('../config/config')
const controllerLogger = require('./logger')

const logger = controllerLogger.child({ module: 'pushpin' })

const mountFormatObject = ({ data, realtime }) => {
  const publishData = `${JSON.stringify(data)}\n`

  if (realtime) {
    return {
      'http-stream': {
        content: publishData
      }
    }
  }

  return {
    'http-response': {
      body: publishData
    }
  }
}

const publishData = ({ data, channel, realtime }) => {
  axios
    .post(config.pushpin.publishUrl, {
      items: [
        {
          channel,
          formats: mountFormatObject({ data, realtime })
        }
      ]
    })
}

const setChannelHeaders = realtime => {
  if (realtime) {
    return {
      'Content-Type': 'text/plain',
      'Grip-Hold': 'stream'
    }
  }

  return {
    'Content-Type': 'application/json',
    'Grip-Hold': 'response'
  }
}

const signToChannel = ({ res, channel, realtime }) => {
  const headers = {
    'Grip-Channel': channel,
    ...setChannelHeaders(realtime)
  }

  logger.info({
    channel,
    realtime: Boolean(realtime)
  }, 'User signed to channel')

  res
    .writeHead(200, headers)
    .end('\n')
}

const pushpin = {
  getChannel: ({ channelName, realtime }) => {
    const setChannel = channel => {
      if (realtime) return `rt:user:${channel}`
      return `user:${channel}`
    }

    return setChannel(channelName)
  },
  sign: {
    realtime: ({ res, channel }) => {
      signToChannel({ res, channel, realtime: true })
    },
    response: ({ res, channel }) => {
      signToChannel({ res, channel })
    },
  },
  publish: {
    realtime: ({ data, channel }) => publishData({ data, channel, realtime: true }),
    response: ({ data, channel }) => publishData({ data, channel })
  }
}

module.exports = pushpin
