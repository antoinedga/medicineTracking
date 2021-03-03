/**
 * creates a frozen enum object
 * @param {Array} values
 * @return {Object} enum
 */
function createEnum(values) {
  const E = {};
  for (const val of values) {
    E[val] = val.toLowerCase();
  }
  return Object.freeze(E);
}
module.exports = createEnum;

