const {setConfig} = require('./utils');
const {Config} = require('../../models');
const {callback} = require('../Callbacks');

exports.setProductIdentifiers = setConfig('productIdentifiers');

exports.getProductIdentifiers = (req, res) => {
  Config
      .find({name: 'productIdentifiers'})
      .exec(callback(req, res, 'get config '));
};
exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
};
