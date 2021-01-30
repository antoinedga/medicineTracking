var mongoose = require('mongoose')

const Schema = mongoose.Schema

const inventorySchema = new Schema({
  parent_inventory_id: {
    type: Schema.Types.ObjectId,
    ref: 'inventory',
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: "",
  },
  items: {
    type: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product',
        }
    ],
  },
  child_inventories: {
    type: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'inventory',
        }
    ],
  }
})

module.exports = mongoose.model('inventory', inventorySchema,)
