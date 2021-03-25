// get data
mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Dev:4yTmWteU5nbNfHXQ@cluster0.0yiol.mongodb.net/Dev?retryWrites=true&w=majority', {useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true, useCreateIndex: true}).then(() => console.log('Database Connected')).catch((err) => console.log('Database Connection Error: ', err));
testData = mongoose.model('test', new mongoose.Schema({}), 'test');
data = testData.find({}, (err, res)=>{
  return res;
}).then((doc) => {
  data = doc.map((d) => {
    return d._doc;
  });
});


// shorten field names
fields = {};
fieldsReverse = {};
i = 0;
data.forEach((row) => {
  Object.keys(row).forEach((key) => {
    if (!(key in fields)) fields[key] = 'f'+i++; fieldsReverse[fields[key]] = key;
  });
});
data.forEach((row) => {
  Object.keys(row).forEach((key) => {
    row[fields[key]] = row[key]; delete row[key];
  });
});

// shorten values
values = {};
valuesReverse = {};
i = 0;
data.forEach((row) => {
  Object.values(row).forEach((key) => {
    if (!(key in values)) values[key] = 'v'+i++; valuesReverse[values[key]] = key;
  });
});
data.forEach((row) => {
  Object.keys(row).forEach((key) => {
    row[key] = values[row[key]];
  });
});

// create count object
counts = {};
data.forEach((row) => {
  Object.keys(row).forEach((key) => {
    if (!(key in counts)) counts[key] = {}; if (!(counts[key][row[key]])) counts[key][row[key]] = 0; counts[key][row[key]]++;
  });
});

// find fields to ignore
ignore = {};
Object.keys(counts).forEach((key) => {
  ignore[key] = false;
});
// ignore unique ids ( greater then 50% have unique values)
Object.keys(counts).forEach((key) => {
  if (ignore[key]) return; if (Object.keys(counts[key]).length > data.length/2) ignore[key] = true;
});
// ignore common fields ( greater then 25% have the same value)
Object.keys(counts).forEach((key) => {
  if (ignore[key]) return; Object.keys(counts[key]).forEach((val) => {
    if (counts[key][val] > data.length/4) ignore[key] = true;
  });
});

/**
 * {
 *    numSame_f1: 7,
 *    numSame_f2: 1,
 *    numSame_f3: 7
 *    numSame_f4: 7,
 *    numSame_f5: 140,
 * }
 *
 * set = [f1,f3,f4]
 */
sets = {};
data.forEach((row) => {
  tmp = {}; Object.keys(counts).forEach((key) => {
    if (ignore[key]) return; c=counts[key][row[key]]; if (!(c in tmp)) tmp[c] = []; tmp[c].push(key);
  }); Object.values(tmp).forEach((val) => {
    if (val.length < 3) return; if (!(val in sets)) sets[val] = 0; sets[val]++;
  });
});
fieldCounts = {};
Object.keys(sets).forEach((set) => {
  set.split(',').forEach((key) => {
    if (!(key in fieldCounts))fieldCounts[key]=0; fieldCounts[key] += sets[set];
  });
});
