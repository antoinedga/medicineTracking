/* eslint-disable no-throw-literal */

const {Order, Inventory} = require('../../../models');


/**
 *
 * @param {String} path
 * @param {Boolean} desired
 * @return {Promise<*>}
 */
function inventoryExists(path, desired=true) {
  return Inventory
      .findOne({path}, {path: 1})
      .then((inv) => {
        const exists = {
          response: desired,
          message: `Inventory: ${path}, exists`,
          content: inv,
        };
        const notExist = {
          response: !desired,
          message: `Inventory: ${path}, does not exists`,
          content: inv,
        };
        const succ = (desired) ? exists : notExist;
        const err = (desired) ? notExist : exists;

        if (!(inv)^desired) {
          return succ;
        }
        throw err;
      })
      .catch((err) => {
        throw err;
      });
};

/**
 *
 * @param {String} orderNumber
 * @param {Boolean} desired
 * @return {Promise<*>}
 */
function orderNumberExists(orderNumber, desired=true) {
  return Order
      .findOne({orderNumber}, {orderNumber: 1})
      .then((order) => {
        const exists = {
          response: desired,
          message: `OrderNumber: ${orderNumber}, exists`,
          content: order,
        };
        const notExist = {
          response: !desired,
          message: `OrderNumber: ${orderNumber}, does not exists`,
          content: order,
        };
        const succ = (desired) ? exists : notExist;
        const err = (desired) ? notExist : exists;

        if (!(order)^desired) {
          return succ;
        }
        throw err;
      })
      .catch((err) => {
        throw err;
      });
};

/**
 *
 * @param {String} orderNumber
 * @return {Promise<*>}
 */
function orderNumberIsUnique(orderNumber) {
  return Order
      .findOne({orderNumber}, {orderNumber: 1})
      .then((order) => {
        if (!order) {
          return {
            response: true,
            message: `OrderNumber: ${orderNumber}, does not exists`,
            content: order,
          };
        }
        throw {
          response: false,
          message: `OrderNumber: ${orderNumber}, already exists`,
          content: order,
        };
      })
      .catch((err) => {
        throw err;
      });
};

module.exports = {
  inventoryExists,
  orderNumberIsUnique,
  orderNumberExists,
};
