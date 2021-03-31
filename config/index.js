require('dotenv').config();

const config = {
  dev: 'development',
  prod: 'production',
  port: process.env.PORT || 8080,
  saltRounds: 10,
  exp: {
    jwtToken: process.env.JWT_TOKEN_EXP || '30m',
    jwtRefreshToken: process.env.JWT_REFRESH_TOKEN_EXP || '9999d',
  },
  secrets: {
    jwtToken: process.env.JWT_TOKEN || 'greenbanana',
    jwtRefreshToken: process.env.JWT_REFRESH_TOKEN || 'purpleapple',
  },
  custom: {
    productIdentifiers: ['name', 'ndc', 'supplier'],
    quantityField: 'amount',
    NDCField: 'product_ndc',
  },
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;


module.exports = config;

