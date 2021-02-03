const mongoose = require('mongoose')
const {productSchema} = require('./EachesDatabase').Product

// Product Schema
const itemSchema = new mongoose.Schema({
    product: {
        type: productSchema,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('item', itemSchema)
