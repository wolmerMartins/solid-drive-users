'use strict'

const express = require('express')
const router = express.Router()

const routesV1 = require('./routesV1')

router.use('/api/v1/users', routesV1)

router.use((req, res) => res
  .status(404)
  .json({
    message: 'Route not found',
    code: 'notFound0',
    type: 'router'
  })
)

module.exports = router
