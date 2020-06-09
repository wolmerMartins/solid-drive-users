'use strict'

const axios = require('axios')

const config = require('../config/config')
const controllerLogger = require('./logger')

const logger = controllerLogger.child({ module: 'pushpin' })

const mountFormatObject = ({ data, close, realtime }) => {
  if (close) {
    return {
      'http-stream': {
        action: 'close'
      }
    }
  }

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

const publishData = ({ data, close, channel, realtime }) => {
  axios
    .post(config.pushpin.publishUrl, {
      items: [
        {
          channel,
          formats: mountFormatObject({ data, close, realtime })
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

const signToChannel = ({ res, message, channel, realtime }) => {
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
    .end(JSON.stringify({ success: true, message }))
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
    response: ({ res, message, channel }) => {
      signToChannel({ res, message, channel })
    },
  },
  publish: {
    realtime: ({ data, close, channel }) => {
      publishData({ data, channel, realtime: true })
      if (close) publishData({ close, channel })
    },
    response: ({ data, channel }) => publishData({ data, channel })
  }
}

module.exports = pushpin
