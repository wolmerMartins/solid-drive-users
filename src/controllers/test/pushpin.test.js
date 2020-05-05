'use strict'

const chai = require('chai')

const pushpin = require('../pushpin')

const expect = chai.expect

const responseMock = {
  writeHead: function(status, headers) {
    this.status = status
    this.headers = headers

    return this
  },
  end: function(text) { return text },
  clearMocks: function() {
    delete this.status
    delete this.headers
  }
}

describe('pushpin', () => {
  const realtime = true
  const channelName = 'test'

  afterEach(() => responseMock.clearMocks())

  describe('getChannel', () => {
    it('Should return the channel to sign on pushpin', () => {
      expect(pushpin.getChannel({ channelName }))
        .to
        .equal(`user:${channelName}`)
    })

    it('Should return the realtime channel to sign on pushpin', () => {
      expect(pushpin.getChannel({ channelName, realtime }))
        .to
        .equal(`rt:user:${channelName}`)
    })
  })

  describe('sign', () => {
    it('Should sign to the given channel for realtime stream', () => {
      pushpin.sign.realtime({ res: responseMock, channel: 'rt:user' })

      expect(responseMock)
        .to.include.any.keys('status', 'headers')

      expect(responseMock.status)
        .to.equal(200)

      expect(responseMock.headers)
        .to.include.any.keys('Content-Type', 'Grip-Hold', 'Grip-Channel')

      expect(responseMock.headers)
        .to.eql({
          'Content-Type': 'text/plain',
          'Grip-Hold': 'stream',
          'Grip-Channel': 'rt:user'
        })
    })

    it('Should sign to the given channel for response', () => {
      pushpin.sign.response({ res: responseMock, channel: 'user' })

      expect(responseMock)
        .to.include.any.keys('status', 'headers')

      expect(responseMock.status)
        .to.equal(200)

      expect(responseMock.headers)
        .to.include.any.keys('Content-Type', 'Grip-Hold', 'Grip-Channel')

      expect(responseMock.headers)
        .to.eql({
          'Content-Type': 'application/json',
          'Grip-Hold': 'response',
          'Grip-Channel': 'user'
        })
    })
  })
})
