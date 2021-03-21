/**
 * object returned by a validation function
 * @typedef {{valid: Boolean, error: string}} ValidationObject
 *
 * a function that validates an input
 * @typedef {function(any): ValidationObject} ValidationFunction
 */

/**
 * checks if the value is an array of strings
 * @param {any} value
 * @return {ValidationObject}
 */
function checkArrayOfStrings(value) {
  if (!value) {
    return {
      valid: false,
      error: 'Requires: array of strings. Given: empty value.',
    };
  }
  if (!Array.isArray(value)) {
    return {
      valid: false,
      error: 'Requires: array of strings. Given: not an array.',
    };
  }
  for (elem in value) {
    if (typeof elem != 'string') {
      return {
        valid: false,
        error: `Requires: array of strings.`+
          `Given: array containing ${typeof elem}.`,
      };
    }
  }
  return {valid: true};
}

module.exports = {
  checkArrayOfStrings,
};
