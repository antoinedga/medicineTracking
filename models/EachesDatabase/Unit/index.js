var mongoose = require('mongoose')

const Schema = mongoose.Schema

const unitSchema = new Schema({
  name: {
    type: String,
    ref: 'product',
  },
  Description: {
    type: String,
  },
})

exports.Unit = mongoose.model('unit', unitSchema)
exports.UnitSchema = unitSchema