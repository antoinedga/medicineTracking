const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream'); // version 2.x

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log'),
});

module.exports = morgan(
    'METHOD::method | '+
    'PATH: ":url" | '+
    'STATUS::status | '+
    'res-time :response-time ms\n' +
    'DATE: :date[clf] UTC Format\n' +
    'IP: :remote-addr\n' +
    '________________________________________________________________________',
    {stream: accessLogStream});
