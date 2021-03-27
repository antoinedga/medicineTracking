const {
  productIdentifiers: pIDs,
  quantityField,
} = require('../../config').custom;
const Order = require('../../models/order');

Order.schema.obj;
// {
//     path: String,
//     orderNumber: String,
//     orderDate: Date,
//     items: [{
//         product: {
//           identifiers: [{key,value}]
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         desired: {
//           identifiers: [{key,value}],
//         },
//       }],
//       required: true,
//       _id: false,
//     },
//     status: {
//       type: String,
//     },
//     expectedDelivery: {
//       type: Date,
//     },
//     trackingNumber: {
//       type: String,
//     },
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'user',
//     },
//   }
/**
 *
 * @param {*} order1
 * @param {*} order2
 * @return {*}
 */
function combineOrders(order1, order2) {
  const combinedOrder = {};
  Object.keys(Order.schema.obj).forEach((key) => {
    if (order1[key] != undefined || order2[key] != undefined) {
      combinedOrder[key] = order1[key] || order2[key];
    }
  });

  return combinedOrder;
}

/**
 *
 * @param {*} products
 * @param {[{
 *      product: {identifiers:[{key: string, value: string}]},
 *      quantity: Number,
 *      desired: {identifiers:[{key: string, value: string}]},
 *  }]} items
 * @return {*}
 */
function combineProductsAndDesiredItems(products, items) {
  const combinedOrder = [];
  const _desired = {};
  const _products = {};
  // turn items into objects and save them to _desired
  // with a key made from its product identifers
  //
  items.forEach((item) => {
    const _item = keyValuePairsToObject(item.desired.identifiers);
    _item[quantityField] = item.quantity;
    _desired[pIDs.map((id) => _item[pid]).join(',')] = _item;
  });

  // save each product to _products with a key made from its product identifers
  products.forEach((product) => {
    _products[pIDs.map((id) => product[pid]).join(',')] = product;
  });

  //
  Object.entries(_products).forEach(([key, value]) => {
    const item = {};
    item['quantity'] = value[quantityField];
    delete value[quantityField];
    item['product'] = objectToKeyValuePairs(value);
    if (_desired[key]) {
      delete value[quantityField];
      item['desired'] = objectToKeyValuePairs(_desired[key]);
      delete _desired[key];
    }
    combinedOrder.push(item);
  });

  Object.values(_desired).forEach((value) => {
    const item = {};
    item['quantity'] = value[quantityField];
    delete value[quantityField];
    item['desired'] = objectToKeyValuePairs(_desired[key]);
    combinedOrder.push(item);
  });

  return combinedOrder;
}

/**
 *
 * @param {Object} object
 * @return {[{key: string, value: *}]}
 */
function objectToKeyValuePairs(object) {
  return Object.entries(object).reduce(function(result, [key, value]) {
    if (value == undefined) return result;
    result.push({key, value});
    return result;
  }, []);
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
  combineOrders,
  objectToKeyValuePairs,
  keyValuePairsToObject,
  combineProductsAndDesiredItems,
};
