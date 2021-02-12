const mongoose = require('mongoose')

// Order Schema
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    products: [
        {
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
        }
    ],
    user_name: { 
        type: mongoose.Schema.Types.String, 
        ref: 'User',
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('order', orderSchema )
