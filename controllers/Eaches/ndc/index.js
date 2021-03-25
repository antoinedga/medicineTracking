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
  return axios.get(`${NDC_URL}?search=${query}`)
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
  const regexPackageNDC = /^\d{5}-\d{3}-\d{2}$/;
  return !ndc.replace(regexPackageNDC, '');
}

/**
 *
 * @param {String} ndc
 * @return {Boolean}
 */
function isValidNDC(ndc) {
  const validNDC = /^\d{5}-\d{3}-(\d{2})?$/;
  return !ndc.replace(validNDC, '');
}

/**
 * Searches the ndc database for the given ndc
 *
 * @param {String} ndc
 * @return {Promise<SuccessObject>}
 */
async function searchNDC(ndc) {
  const searchField = (isFullNDC(ndc)) ? 'packaging.package_ndc': 'product_ndc';

  return search(`${searchField}:${ndc}`)
      .then((val) => {
        console.log(val);
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
        console.log(res);
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
