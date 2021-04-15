const validation = require('./validation');

/**
 * @typedef {import('./validation').ValidationFunction} ValidationFunction
 */

/**
 * @type {Map<string,ValidationFunction>}
 */
const configTypes = new Map([
  ['productIdentifiers', validation.checkArrayOfStrings],
  ['quantityField', validation.checkString],
  ['NDCField', validation.checkNDC],
  ['fieldsForWebsite', validation.checkArrayOfStrings],
  ['orderStatusOptions', validation.checkArrayOfStrings],
]);

module.exports = {
  configTypes,
};
