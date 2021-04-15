const fs = require('fs');
const {
  productIdentifiers: pIDs,
  quantityField,
} = require('../../config').custom;
const Order = require('../../models/order');
const {
  addEachesToProducts,
} = require('../Eaches/utils');

/**
 *
 * @typedef {[{
 *      product: {identifiers:[{key: string, value: string}]},
 *      quantity: Number,
 *      desired: {identifiers:[{key: string, value: string}]},
 *  }]} OrderItems
 */

/**
 * @typedef {import('../Eaches/utils').UserDefinedProduct} UserDefinedProduct
 */


/**
 *
 * get eaches for each product
 * if no eaches in database put product has ndc
 *    get eaches by ndc
 * combine products and old order
 * save
 * @param {*} req
 * @param {*} res
 * @param {*} orderData
 * @param {String} uploadPath
 * @return {Function}
 */
function doWork(req, res, orderData, uploadPath) {
  return () => {
    addEachesToProducts(objectsToProducts(orderData))
        .then((_products) => updateOrderData(req.body.orderNumber, _products))
        .then((doc) => {
          return res
              .status(200)
              .json(doc);
        })
        .catch((err) => {
          return res
              .status(400)
              .json({
                response: false,
                message: `Error ocurred while saving uploaded order data`,
                content: err,
              });
        }).finally( () => {
          fs.unlink(uploadPath, () => { });
        });
  };
}

/**
 *
 * @param {String} orderNumber
 * @param {[*]} products
 */
async function updateOrderData(orderNumber, products) {
  return Order
      .findOne({orderNumber})
      .then((doc) => {
        if (doc == undefined) {
          throw new Error('No matching order');
        }
        doc.items = combineProductsAndDesiredItems(products, doc.items);
        return doc.save();
      })
      .then((doc) => {
        return {
          response: true,
          message: `Successfully updated order`,
          content: doc,
        };
      })
      .catch((err) => {
        return {
          response: false,
          message: `Error while updating order`,
          content: err,
        };
      });
}


/**
 *
 * @param {[UserDefinedProduct]} products
 * @param {OrderItems} items
 * @return {OrderItems} combinedItems
 */
function combineProductsAndDesiredItems(products, items) {
  const combinedItems = [];
  const _desired = {};
  const _products = {};

  // turn items into objects and save them to _desired
  // with a key made from its product identifers
  items.forEach((item) => {
    if (!item.desired) return;
    addProductToDictionary(item.desired, _desired, false, item);
  });

  // save each product to _products with a key made from its product identifers
  products.forEach((product) => {
    addProductToDictionary(product, _products, true);
  });
  //
  Object.entries(_products).forEach(([key, value]) => {
    const item = {};
    item['quantity'] = value.identifiers[quantityField];
    delete value.identifiers[quantityField];
    value.identifiers = objectToKeyValuePairs(value.identifiers);
    item['product'] = value;
    if (_desired[key]) {
      item['desired'] = _desired[key].desired;
      delete _desired[key];
    }
    combinedItems.push(item);
  });
  Object.values(_desired).forEach((value) => {
    combinedItems.push(value);
  });

  return combinedItems;
}

/**
 * adds products to a dictionary based on their pIDs
 * @param {UserDefinedProduct} product
 * @param {*} dictionary
 * @param {Boolean} keepObject
 * @param {*} value
 */
function addProductToDictionary(product, dictionary, keepObject=false, value) {
  const identifiers = keyValuePairsToObject(product.identifiers);
  const key = pIDs.map((id) => identifiers[id]).join(',');
  let ext = 0;
  while (dictionary.hasOwnProperty(key + ext)) {
    ext++;
  }
  if (keepObject) {
    product.identifiers = identifiers;
  }
  if (value != undefined) {
    dictionary[key + ext] = value;
  } else {
    dictionary[key + ext] = product;
  }
}

/**
 *
 * @param {Object} object
 * @return {[{key: string, value: *}]}
 */
function objectToKeyValuePairs(object) {
  return Object.entries(object).reduce(function(result, [key, value]) {
    if (value == undefined || value == '') return result;
    result.push({key, value});
    return result;
  }, []);
}
/**
 *
 * @param {Object} object
 * @return {UserDefinedProduct}
 */
function objectToProduct(object) {
  return {
    identifiers: objectToKeyValuePairs(object),
  };
}

/**
 *
 * @param {[Object]} array
 * @return {[UserDefinedProduct]}
 */
function objectsToProducts(array) {
  return array.map(objectToProduct);
}

/**
 *
 * @param {[{key: string, value: *}]} pairs
 * @return {Object}
 */
function keyValuePairsToObject(pairs) {
  const obj = {};
  pairs.forEach(({key, value}) => obj[key]=value);
  return obj;
}

module.exports = {
  doWork,
  updateOrderData,
  objectToKeyValuePairs,
  objectToProduct,
  objectsToProducts,
  keyValuePairsToObject,
  combineProductsAndDesiredItems,
};
