const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const unitSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  Description: {
    type: String,
  },
});

exports.Unit = mongoose.model('unit', unitSchema);
exports.UnitSchema = unitSchema;
