const {checkArrayOfStrings} = require('./validation');

/**
 * @typedef {import('./validation').ValidationFunction} ValidationFunction
 */

/**
 * @type {Map<string,ValidationFunction>}
 */
const configTypes = new Map([
  ['productIdentifiers', checkArrayOfStrings],
]);

module.exports = {
  configTypes,
};
