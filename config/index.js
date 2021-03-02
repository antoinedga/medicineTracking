require('dotenv').config();

const config = {
  dev: 'development',
  prod: 'production',
  port: process.env.PORT || 8080,
  secrets: {
    jwt: process.env.JWT || 'greenbanana',
  },
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;


module.exports = config;

