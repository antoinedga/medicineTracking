const mongoose = require('mongoose')
const uuidv4 = requie('uuid/v4')
const product = require('./product')

// Order Schema
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        default: uuidv4
    },
    orderData: {
        type: Date,
        required: true,
        default: Date.now
    },
    order: {
        type: [ product ],
        required: true,
    }
})

module.exports = mongoose.model('order', orderSchema )
