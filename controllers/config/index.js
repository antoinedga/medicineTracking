const {setConfig} = require('./utils');
const {callback} = require('../Callbacks');
const {configTypes} = require('./configTypes');
const config = require('../../config');


exports.set = setConfig();

exports.getAllNames = (req, res) => {
  callback(req, res, 'get all config names')(null, [...configTypes.keys()]);
};

exports.get = (req, res) => {
  callback(
      req,
      res,
      `get config ${req.params.name}`,
  )(config.custom[req.params.name]);
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
};
