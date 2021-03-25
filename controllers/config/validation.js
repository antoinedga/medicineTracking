/**
 * object returned by a validation function
 * @typedef {{valid: Boolean, error: string}} ValidationObject
 *
 * a function that validates an input
 * @typedef {function(any): ValidationObject} ValidationFunction
 */

/**
 *
 * @param  {...ValidationFunction} checks
 * @return {ValidationObject}
 */
function validate(...checks) {
  return (value) => {
    checks.forEach( (check) => {
      const validation = check(value);
      if (!validation.valid) return validation;
    });
  };
}
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

/**
 * checks if the value is a string
 * @param {any} value
 * @return {ValidationObject}
 */
function checkString(value) {
  if (typeof value != 'string') {
    return {
      valid: false,
      error: `Requires: string.`+
      `Given: ${typeof value}.`,
    };
  }
  return {valid: true};
}

/**
 * checks if the value is a ndc
 * @param {any} value
 * @return {ValidationObject}
 */
function checkNDC(value) {
  const validNDC = /^\d{5}-\d{3}-(\d{2})?$/;
  if (typeof value != 'string' ||
  !ndc.replace(validNDC, '')
  ) {
    return {
      valid: false,
      error: `Requires: string with format: ${validNDC}`+
      `Given: value`,
    };
  }
  return {valid: true};
}


module.exports = {
  validate,
  checkArrayOfStrings,
  checkString,
  checkNDC,
};
