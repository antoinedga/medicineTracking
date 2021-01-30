var _ = require('lodash')
require('dotenv').config()

var config = {
  dev: 'development',
  prod: 'production',
  port: process.env.PORT || 80,
  secrets: {
    jwt: process.env.JWT || 'greenbanana'
  }
}

process.env.NODE_ENV = process.env.NODE_ENV || config.dev
config.env = process.env.NODE_ENV


module.exports = config