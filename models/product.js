const mongoose = require('mongoose')

// Product Schema
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    manufacturer_name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true
    },
    total_quantity: {
        type: Number,
        required: true
    },
    location: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Product', productSchema)
