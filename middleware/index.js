const tokenAuth = require('./TokenAuth');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

module.exports = [
  express.json(),
  express.urlencoded({extended: false}),
  helmet(),
  cors(),
  hpp(),
  tokenAuth(),
];
