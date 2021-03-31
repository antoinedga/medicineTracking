const config = require('../../config');
const JWT = require('jsonwebtoken');

const decodeToken = (req, res, next) => {

  if (req?.headers?.authorization?.split(' ')[0] === 'Bearer') {
    JWT.verify(
      req.headers.authorization.split(' ')[1],
      config.secrets.jwtToken,
      (err, decode) => {
        req.auth = decode;
        if (err) req.auth = undefined;
      });
  } else {
    req.auth = undefined;
  }
  next();
};

module.exports = () => {
  return decodeToken;
};

