const tokenAuth = require('./TokenAuth');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const logger = require('./Logger');
const fileUpload = require('express-fileupload');

module.exports = [
  fileUpload({
    useTempFiles: true,
  }),
  express.json(),
  express.urlencoded({extended: false}),
  helmet(),
  cors(),
  hpp(),
  tokenAuth(),
  logger,
];
