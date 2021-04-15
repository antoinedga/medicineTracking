
// eslint-disable-next-line max-len
const {ProductDefinition, Unit} = require('../../models/EachesDatabase');
const {callback} = require('../Callbacks');
const {toArray} = require('../utils');
const {
  createProductDefinitionWithEaches,
  aggregate: {
    fuzzySearch,
    attachTopEaches,
  },
} = require('./utils');


exports.saveConfirmedProductData = (req, res) => {
  createProductDefinitionWithEaches(req.body)
      .then((result) => {
        return res
            .status(result.response ? 200 : 400)
            .json(result);
      }).catch((err) => {
        return res
            .status(400)
            .json({
              response: false,
              message: `Error during save confirmed product data`,
              content: err,
            });
      });
};

exports.saveAllConfirmedProductData = (req, res) => {
  /**
   * @type {[UserDefinedProduct]}
   */
  const userDefinedProducts = req.body;
  const promises = userDefinedProducts.map((userDefinedProduct) =>
    createProductDefinitionWithEaches(userDefinedProduct),
  );

  Promise.all(promises).then((value) => {
    return res
        .status(200)
        .json({
          response: true,
          message: `processed all product definitions`,
          content: value,
        });
  }).catch((err) => {
    return res
        .status(400)
        .json({
          response: false,
          message: `Error processing all product definitions`,
          content: err,
        });
  });
};

exports.search = (req, res) => {
  return ProductDefinition
      .aggregate([].concat(
          fuzzySearch(req.body.query),
          attachTopEaches(),
      ))
      .exec(callback(req, res, 'search product definitions'));
};


exports.getUnits = (req, res) => {
  Unit.find({})
      .exec(callback(req, res, 'get eaches units'));
};

// http://data.bioontology.org/documentation <- get definitions
exports.addUnits = (req, res) => {
  const units = toArray(req.body).reduce((result, name) => {
    if (name) {
      result.push({name});
    }
    return result;
  }, []);

  Unit.create(units, callback(req, res, 'add eaches units'));
};
