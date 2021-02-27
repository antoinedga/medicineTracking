var mongoose = require('mongoose')

const Schema = mongoose.Schema

const inventorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: "",
    unique: true,
  },
})

module.exports = mongoose.model('inventory', inventorySchema)
