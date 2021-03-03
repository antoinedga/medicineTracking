var fs = require('fs');
var AccessControl = require('./actions');

ac = new AccessControl()
stringify = (o) => {
    s = 'module.exports = {\n'
    Object.keys(o).forEach(key => {
        val = ''
        if (typeof o[key] == "object")
            val = JSON.stringify(o[key]).replace(/\"([^(\")"]+)\":/g,"$1:")

        else 
            val = o[key]
        s += key + ': '+ val + ',\n'
    })
    return s + '\n}'
}
var t = stringify(ac)
console.log("test- " + ac)
fs.writeFile('test.js', stringify(ac), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

