'use strict'

const express = require('express')
const router = express.Router()

const publicRoutes = require('./public')

router.use('/api/v1/users', publicRoutes)

router.use((req, res) => res
  .status(404)
  .json({
    message: 'Route not found',
    code: 'notFound0',
    type: 'router'
  })
)

module.exports = router
