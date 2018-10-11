'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.10.17:3000/allgovision"',
  DATABASE_API: '"http://192.168.10.17:3000/api"',
})
