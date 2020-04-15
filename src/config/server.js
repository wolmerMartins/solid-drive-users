'use strict'

const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')

const app = express()

app.use(helmet())
app.use(morgan((tokens, req, res) => (
  JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    contentLength: tokens.res(req, res, 'content-length'),
    time: `${tokens['response-time'](req, res)} ms`
  })
)))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

module.exports = app
