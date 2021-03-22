/* eslint-disable */
// const fs = require('fs');
// const AccessControl = require('./actions');

// ac = new AccessControl();

stringify = (o, newLine=false) => {
  if (typeof o == 'object') {
    if (Array.isArray(o)) {
      return stringifyArray(o,newLine)
    }
    return stringifyObject(o,newLine);
  }
  if (typeof o == 'string') {
    return JSON.stringify(o)
  }
  return o + ''
}
stringifyObject = (o, newLine=false) => {
  const n = (newLine)? '\n':'';
  let s = '{'+n;
  Object.keys(o).forEach((key) => {
    let val = '';
    val = stringify(o[key],newLine);
    s += `'`+key +`'`+ ': '+ val + ','+n;
  });
  return s +'}';
};
stringifyArray = (arr, newLine=false) => {
  const n = (newLine)? '\n':'';
  let s = '['+n;
  arr.forEach(obj => {
    let val = stringify(obj,newLine)
    s += val + ','+n;
  })
  return s + ']';
}
// const t = stringify(ac);
// console.log('test- ' + ac);
//JSON.stringify(o[key]).replace(/\"([^(\")"]+)\":/g, '$1:');

tmp = {a: 1,b: (x) => {console.log(x)},f: ['1',"2","red",'red'],d: {a: 1,b: (x) => {console.log(x)},c: [1,2,3],},}

str = stringify({a: 1,b: (x) => {console.log(x)},f: ['1',"2","red",'red'],d: {a: 1,b: (x) => {console.log(x)},c: [1,2,3],},})

x = {
  'tes t': 1
}


exports.testing = [{'s':1}]