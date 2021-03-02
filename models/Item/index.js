const mongoose = require('mongoose');
const {ProductSchema} = require('../EachesDatabase');

// Item Schema
const itemSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  product: {
    type: ProductSchema,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

itemSchema.index( {path: 1} );
module.exports = mongoose.model('item', itemSchema);
