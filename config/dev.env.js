'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"/apidev"',
  WSS_API: '"wss://digital-test.auc2.com/internal/websocket/listen"'
  // BASE_API: '""'
})
