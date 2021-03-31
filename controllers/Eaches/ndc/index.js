const axios = require('axios').default;


const NDC_URL = 'https://api.fda.gov/drug/ndc.json';


/**
 * @typedef {{
 *           success: boolean,
 *           message: string,
 *           content: any,
 *         }} SuccessObject
 */

/**
 * search ndc database
 * @param {String} query
 * @param {Number} limit
 * @param {Number} skip
 * @return {Promise<SuccessObject>}
 */
async function search(query, limit=1, skip=0) {
  return axios.get(`${NDC_URL}?search=${query}&limit=${limit}&skip=${skip}`)
      .then( (response) => {
        if (response.data.error != undefined) throw response.data;
        return {
          success: true,
          message: `Successfully completed ndc search`,
          content: response.data.results,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: `Error ocurred during ndc search`,
          content: err,
        };
      });
};

/**
 *
 * @param {String} ndc
 * @return {Boolean}
 */
function isFullNDC(ndc) {
  // eslint-disable-next-line max-len
  const regexPackageNDC = [
    /^\d{5}-\d{3}-\d{2}?$/,
    /^\d{4}-\d{4}-\d{2}?$/,
    /^\d{5}-\d{4}-\d{1}?$/,
  ];
  const result = regexPackageNDC.reduce((result, regex) => {
    result |= !ndc.replace(regex, '');
    return result;
  }, false);
  return result;
}
/**
 *
 * @param {String} ndc
 * @return {Boolean}
 */
function isValidNDC(ndc) {
  if (ndc == undefined) return false;
  // eslint-disable-next-line max-len
  const validNDC = [
    /^\d{5}-\d{3}(-\d{2})?$/,
    /^\d{4}-\d{4}(-\d{2})?$/,
    /^\d{5}-\d{4}(-\d{1})?$/,
  ];
  const result = validNDC.reduce((result, regex) => {
    result |= !ndc.replace(regex, '');
    return result;
  }, false);
  return result;
}

// 73126-010 ndc
// [0] 73126-010 invalid
// [0] 72920-2018 ndc
// [0] 72920-2018 invalid
// [0] 72827-100-05 ndc
// [0] 73408-609-33 ndc
// [0] 73126-010 ax
// [0] 72920-2018 ax

/**
 * Searches the ndc database for the given ndc
 *
 * @param {String} ndc
 * @return {Promise<SuccessObject>}
 */
async function searchNDC(ndc) {
  if (!isValidNDC(ndc)) {
    return {
      success: false,
      message: `Invalid ndc`,
      content: ndc,
    };
  };
  const searchField = (isFullNDC(ndc)) ? 'packaging.package_ndc': 'product_ndc';

  return search(`${searchField}:${ndc}`)
      .then((val) => {
        if (!val.success) throw val.content;
        return {
          success: true,
          message: `Successfully completed ndc search`,
          content: val.content,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: `Error ocurred during ndc search`,
          content: err,
        };
      });
};
/**
 *
 * @param {String} description
 * @return {[{type:string,value:string}]}
 */
function tokenizePackageDescription(description) {
  description = description.replace(/[(][0-9]*-[0-9]*-[0-9]*[)]/, '');
  const strings = description.split(/ +/);
  const tokens = [];

  for (i = 0; i < strings.length; i++) {
    const token = {
      type: '',
      value: strings[i],
    };
    if (strings[i] == 'in') {
      token.type = 'in';
    } else if (strings[i] == '*') {
      token.type = 'list';
    } else if (strings[i] == '>') {
      token.type = 'and';
    } else if (!isNaN(strings[i])) {
      token.type = 'quantity';
    } else {
      token.type = 'unit';
      if (tokens[tokens.length-1].type == 'unit') {
        tokens[tokens.length-1].value += ` ${strings[i]}`;
        continue;
      }
    }
    tokens.push(token);
  }
  return tokens;
}

/**
 *
 * @param {String} description
 * @return {*}
 */
function parsePackageDescription(description) {
  const tokens = tokenizePackageDescription(description);
  let parent;
  let backOne;
  let current;
  let i = 0;

  const getSingle = () => {
    return {
      quantity: parseFloat(tokens[i++].value),
      unit: tokens[i++].value,
      contains: [],
    };
  };
    // 1. current = getSingle, +2
  current = getSingle();
  // 2. skip in, +1
  i++;
  // 3. head = getSingle, head.contains <- current, +2
  const head = getSingle();
  head.contains.push(current);
  // 4. backOne = current
  backOne = current;

  const steps5to15 = () => {
    // 5. if and, +1, else 10
    const ifAnd = () => {
      if (tokens[i]?.type == 'and') {
        i++;
        // 6. current = getSingle, +2
        current = getSingle();
        // 7. skip in, +1
        i++;
        // 8. skip getSingle, +2,
        getSingle();
        // 9. backOne.contains <- current, backOne = current, repeat 5-9
        backOne.contains.push(current);
        backOne = current;
        ifAnd();
      }
    };
    ifAnd();

    // 10. if list, +1, parent = backOne else jump 16
    const ifList = () => {
      if (tokens[i]?.type == 'list') {
        i++;
        if (!parent) {
          parent = backOne;
        }
        // 11. current = getSingle, +2
        current = getSingle();
        // 12. skip in, +1
        i++;
        // 13. backOne = getSingle, backOne.contains <- current, +2
        backOne = getSingle();
        backOne.contains.push(current);
        // 14. parent.contains <- backOne, backOne = current
        parent.contains.push(backOne);
        backOne = current;
        // 15. repeat 5-15
        steps5to15();
      }
    };
    ifList();
  };
  steps5to15();
  return head;
}

/**
 * get eaches from ndc database and returns
 * an array containing the pared eaches
 * @param {string} ndc
 * @return {Promise<SuccessObject>} eaches
 */
async function getEaches(ndc) {
  return searchNDC(ndc)
      .then((res) => {
        if (!res.success) throw res.content;
        const product = res.content[0];
        const packages = product.packaging;
        const packageDescription = [];
        if (isFullNDC(ndc)) {
          const pkg = packages.find((pkg) => pkg.package_ndc == ndc);
          packageDescription.push(pkg.description);
        } else {
          packages.forEach((pkg) => {
            packageDescription.push(pkg.description);
          });
        }
        const eaches = packageDescription.map((des) => {
          return parsePackageDescription(des);
        });

        return {
          success: true,
          message: `Successfully obtained eaches`,
          content: eaches,
        };
      }).catch((err) => {
        return {
          success: false,
          message: `Error ocurred while obtaining eaches`,
          content: err,
        };
      });
}
module.exports = {
  getEaches,
};
