/* eslint-disable require-jsdoc */
const config = require('../../config');
const {Product} = require('../../../models').EachesDatabase;
const {callback} = require('../Callbacks');


exports.getAll = (req, res) => {
  if (process.env.NODE_ENV === config.dev) {
    Product.find({}, callback(req, res, 'get all Products'));
  } else {
    return res.status(401).json({message: 'Unauthorized user!'});
  }
};

/**
 * {
 *  identifyer
 * }
 * @param {*} product 
 */
async function createProduct(product) {

}


module.exports = {
    createProduct,
}