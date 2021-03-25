
// eslint-disable-next-line max-len
const {ProductDefinition, Eaches} = require('../../models/EachesDatabase');
const config = require('../../config');
const {callback} = require('../Callbacks');


// const terms = [
//   {key: 'name', value: '7 Select Aspirin'},
//   {key: 'ndc', value: '10202-416-78'},
//   {key: 'supplier', value: '7-Eleven'},
//   {key: 'price', value: '＄12.08'},
// ];
/**
 * /^\w*ndc\w*$/gmi
 * ^\d{3}-\d{4}-\d{2}$
 */

/**
 * @typedef {{
 *    identifiers:[{key: string, value: string}],
 *    eaches:[{quantity: Number, unit: string}]
 * }} UserDefinedProduct
 */

/**
 * @typedef {{quantity: number, unit: string}} UnitPair
 */

/**
 * @typedef {{key: string, value: string}} KeyValuePair
 */

/**
 * @typedef {{
 *           response: boolean,
 *           message: string,
 *           content: any,
 *         }} ResponseObject
 */

/**
 *
 * @param {*} action
 * @return {function(err: any, doc: any): {
 *           response: boolean,
 *           message: string,
 *           content: any,
 *         }}
 */
function evaluateSuccess(action) {
  return (err, doc) => {
    console.log(err, doc);
    if (err) {
      return {
        response: false,
        message: `Error during ${action}`,
        content: err,
      };
    } else {
      return {
        response: true,
        message: `Successfully completed ${action}`,
        content: doc,
      };
    };
  };
}

/**
 *
 * @param {UnitPair} eaches
 * @param {string} productId
 * @return {Promise<ResponseObject>}
 */
async function incrementEaches(eaches, productId) {
  return Eaches
      .findOneAndUpdate(
          {
            eaches: eaches,
            product_definition_id: productId,
          },
          {
            $set: {
              product_definition_id: productId,
              eaches: eaches,
            },
            $inc: {score: 1},
          },
          {
            upsert: true,
            setDefaultsOnInsert: true,
            useFindAndModify: false,
            new: true,
          },
      )
      .then((doc) => {
        return {
          response: true,
          message: `Successfully completed incrementing eaches`,
          content: doc,
        };
      })
      .catch((err) => {
        return {
          response: false,
          message: `Error during incrementing eaches`,
          content: err,
        };
      });
}

/**
 *
 * @param {UserDefinedProduct} userDefinedProduct
 * @return {Promise<ResponseObject>}
 */
async function createProductDefinition(userDefinedProduct) {
  const identifiers = userDefinedProduct.identifiers;
  const eaches = userDefinedProduct.eaches;
  const definingIdentifiers = identifiers.filter( (pair) => {
    return config.custom.productIdentifiers.includes(pair.key);
  }).sort((a, b) => a.key.localeCompare(b.key));

  const nGrams = [];
  const prefixNGrams = [];
  definingIdentifiers.forEach((pair) => {
    nGrams.push(...makeNGrams(pair.value, 2, 8));
    prefixNGrams.push(...makeNGrams(pair.value, 2, 8, true));
  });
  const productDefinition = {
    identifiers: definingIdentifiers,
    _nGrams: nGrams.join(','),
    _prefixNGrams: prefixNGrams.join(','),
  };

  return ProductDefinition
      .findOneAndUpdate(
          {identifiers: definingIdentifiers},
          productDefinition,
          {
            upsert: true,
            setDefaultsOnInsert: true,
            useFindAndModify: false,
            new: true,
          },
      ).then(async (doc) => {
        return await incrementEaches(eaches, doc._id);
      })
      .catch(evaluateSuccess('defining product'));
};


exports.saveConfirmedProductData = (req, res) => {
  createProductDefinition(req.body)
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
    createProductDefinition(userDefinedProduct),
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
  ProductDefinition
      .find({
        '$text': {
          '$search': makeNGrams(req.body.query, 2, 8).join(','),
        },
      },
      {
        '_id': true,
        'identifiers': true,
        'score': {
          '$meta': 'textScore',
        },
      },
      ).sort({'score': 1})
      .exec(callback(req, res, 'search product definitions'));
};
// a = a.toLowerCase();
// b = b.toLowerCase();
// (a < b)? 1: (a > b)? -1 : 0;
// ProductDefinition
//     .aggregate([
//       {$match: {identifiers: {$in: terms}}},
//       {
//         $addFields: {
//           'num_match': {
//             $size: {
//               $filter: {
//                 input: '$identifiers',
//                 as: 'identifier',
//                 cond: {$in: ['$$identifier', terms]},
//               },
//             },
//           },
//           'match': {
//             $filter: {
//               input: '$identifiers',
//               as: 'identifier',
//               cond: {$in: ['$$identifier', terms]},
//             },
//           },
//         },
//       },
//       {
//         $sort: {num_match: -1},
//       },
//     ])
//     .then((doc) => {
//       console.log(JSON.stringify(doc, null, 4));
//       return res.status(200).json({
//         response: false,
//         message: `Unauthorized`,
//         content: doc});
//     })
//     .catch( (err) => {
//       return null;
//     });

/**
 *
 * @param {String} str
 * @param {Number} minSize
 * @param {Number} maxSize
 * @param {Boolean} prefixOnly
 * @return {[String]} Ngrams
 */
function makeNGrams(str, minSize=3, maxSize=8, prefixOnly=false) {
  const nGrams = [];
  for (let i = 0; i < str.length - minSize; i++) {
    for (
      let size = minSize;
      size <= str.length - i && size <= maxSize;
      size++
    ) {
      const gram = str.substring(i, i + size);
      if (gram.startsWith(' ') || gram.endsWith(' ')) continue;

      if (!prefixOnly || i == 0 || str.charAt(i-1) == ' ') {
        nGrams.push(gram);
      }
    }
  }
  return nGrams;
}
