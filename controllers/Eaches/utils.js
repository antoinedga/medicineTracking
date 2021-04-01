const config = require('../../config');
const {ProductDefinition, Eaches} = require('../../models/EachesDatabase');
const {getEaches} = require('../Eaches/ndc');

/**
 * @typedef {{
 *    identifiers: [KeyValuePair],
 *    eaches: Eaches
 * }} UserDefinedProduct
 */

/**
 * @typedef {{quantity: number, unit: string, contains: [Eaches]}} Eaches
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
 * find or create eaches and increment its score
 * @param {Eaches} eaches
 * @param {string} productId
 * @param {Number} inc - amount to increment score
 * @return {Promise<ResponseObject>}
 */
async function incrementEaches(eaches, productId, inc=1) {
  return Eaches
      .findOneAndUpdate(
          {
            eaches: eaches,
            productDefinition: productId,
          },
          {
            $set: {
              productDefinition: productId,
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
 * take a user defined product and save it as a product definition
 * @param {[*]} products
 * @return {Promise<ResponseObject>}
 */
async function createProductDefinitionUsingNdc(products) {
  products = toArray(products);
  const promises = products.map((product) => {
    return getEaches(product[config.custom.NDCField])
        .then((res) => {
          if (!res.success || res.content == undefined) return null;
          return {
            identifiers: objectToKeyValuePairs(product),
            eaches: res.content,
          };
        });
  });
  Promise.all(promises).then((ndcDefinedProducts) => {
    ndcDefinedProducts.map((product) => {
      if (product == undefined) return null;
      product.eaches.forEach((eaches) => {
        createProductDefinitionWithEaches({
          identifiers: product.identifiers,
          eaches,
        }, 0);
      });
    });
  });
};

/**
 * take a user defined product and save it as a product definition
 * @param {UserDefinedProduct} userDefinedProduct
 * @param {Number} inc - amount to increment score
 * @return {Promise<ResponseObject>}
 */
async function createProductDefinitionWithEaches(userDefinedProduct, inc=1) {
  const identifiers = userDefinedProduct.identifiers;
  const eaches = userDefinedProduct.eaches;
  return createProductDefinition(identifiers)
      .then(async (doc) => {
        return await incrementEaches(eaches, doc._id, inc);
      })
      .catch(evaluateSuccess('defining product'));
};
/**
 * take a user defined product and save it as a product definition
 * @param {[KeyValuePair]} identifiers
 * @param {Number} inc - amount to increment score
 * @return {Promise<ResponseObject>}
 */
async function getProductDefinitionWithEaches(identifiers) {
  return createProductDefinition(identifiers)
      .then(async (doc) => {
        return await incrementEaches(eaches, doc._id, inc);
      })
      .catch(evaluateSuccess('defining product'));
};

/**
 * take a user defined product and save it as a product definition
 * @param {{identifiers:[{key: string, value: string}]}} identifiers
 * @return {Promise<Doc>} ProductDefinitionDoc
 */
async function createProductDefinition(identifiers) {
  const definingIdentifiers = getDefiningIdentifiers(identifiers);

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
      )
      .then( (doc) => {
        return doc;
      })
      .catch((err) => {
        throw err;
      });
};

/**
 *  gets the identifiers that define a product
 * @param {[KeyValuePair]} identifiers
 * @return {[KeyValuePair]}
 */
function getDefiningIdentifiers(identifiers) {
  const i = identifiers.filter((pair) => {
    return config.custom.productIdentifiers.includes(pair.key);
  });
  return i.sort((a, b) => a.key.localeCompare(b.key));
}
/**
 *  gets the ndc from a product
 * @param {[KeyValuePair]} identifiers
 * @return {String}
 */
function getNdc(identifiers) {
  const res = identifiers.filter((pair) => {
    return config.custom.NDCField == pair.key;
  });
  return res[0].value;
}

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


/**
 * Takes a list of products and adds eaches to them.
 * First tries to get eaches from the database then from ndc
 * @param {[UserDefinedProduct]} products
 * @return {Promise<[UserDefinedProduct]>}
 */
async function addEachesToProducts(products) {
  const promises = await getEachesForEachProduct(products)
      .then((_products) => {
        return _products.map((product) => {
          let ndc = '';
          if (product.hasOwnProperty('eaches') ||
          !(ndc = getNdc(product.identifiers))
          ) {
            return product;
          }
          return getEaches(ndc)
              .then((res) => {
                if (!res.success) throw res;
                product.eaches = res.content[0];
                // TO-DO: eaches can be an array. add each to database
                createProductDefinitionWithEaches(product, 0).catch(()=>{});
                return product;
              })
              .catch(() => product);
        });
      })
      .catch(() => products);
  return Promise.all(promises).then((products) => products);
}

/**
 *
 * @param {[{UserDefinedProduct}]} products
 */
async function getEachesForEachProduct(products) {
  const promises = products.map(getEachesForProduct);
  return Promise.all(promises).then((products) => products);
}

/**
 *
 * @param {UserDefinedProduct} product
 * @return {Promise<UserDefinedProduct>}
 */
function getEachesForProduct(product) {
  const res = ProductDefinition.aggregate([].concat(
      matchIdentifiers(getDefiningIdentifiers(product.identifiers)),
      attachTopEaches(),
  ))
      .then((doc) => {
        const eaches = doc[0]?.eaches;
        if (!eaches) {
          return product;
        }
        product.eaches = eaches;
        return product;
      })
      .catch(()=>product);
  return res;
};


// ======================================//
//    Aggregate constructor functions   //
// ====================================//

/**
   * returns the array needed for aggregate fuzzy search
   * @param {KeyValuePair} identifiers
   * @return {Array} array for aggregate fuzzy search
   */
const matchIdentifiers = (identifiers) => [
  {$match: {identifiers: identifiers}},
];

/**
   * returns the array needed for aggregate fuzzy search
   * @param {String} query
   * @return {Array} array for aggregate fuzzy search
   */
const fuzzySearch = (query) => [
  {
    $match: {
      $text: {
        $search: makeNGrams(query, 2, 8).join(','),
      },
    },
  },
  {$set: {score: {'$meta': 'textScore'}}},
  {$sort: {score: -1}},
];

/**
   * returns the array needed to attach top eaches to an aggregate search
   * @return {Array}
   */
const attachTopEaches = () => [
  {
    $lookup: {
      from: 'eaches',
      let: {productId: '$_id'},
      pipeline: [
        {$match: {$expr: {$eq: ['$productDefinition', '$$productId']}}},
        {$sort: {score: -1}},
        {$limit: 1},
      ],
      as: '_eaches',
    },
  },
  {
    $unwind: {path: '$_eaches', preserveNullAndEmptyArrays: true},
  },
  {
    $set: {
      eaches: '$_eaches.eaches',
      eachesScore: '$_eaches.score',
    },
  },
  {
    $unset: ['fromEaches', '_nGrams', '_prefixNGrams', '_eaches'],
  },
];


module.exports = {
  incrementEaches,
  createProductDefinitionUsingNdc,
  createProductDefinitionWithEaches,
  getProductDefinitionWithEaches,
  createProductDefinition,
  makeNGrams,
  getEachesForEachProduct,
  addEachesToProducts,
  aggregate: {
    matchIdentifiers,
    fuzzySearch,
    attachTopEaches,
  },
};


