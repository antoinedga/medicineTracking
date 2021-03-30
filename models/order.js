const mongoose = require('mongoose');
const {ProductSchema} = require('./EachesDatabase');

const Schema = mongoose.Schema;

// Order Schema
const orderSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  items: {
    type: [{
      product: {
        type: ProductSchema,
      },
      quantity: {
        type: Number,
        required: true,
      },
      desired: {
        type: ProductSchema,
      },
    }],
    required: true,
    _id: false,
  },
  status: {
    type: String,
    enum: ['COMPLETE', 'PENDING', 'CANCELED', 'DELAYED'],
    default: 'PENDING',
    required: true,
  },
  expectedDelivery: {
    type: Date,
  },
  trackingNumber: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  log: {
    type: [{
      date: {
        type: Date,
        default: Date.now(),
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    }],
  },
}, {timestamps: true});

orderSchema.index( {path: 1} );
orderSchema.index( {orderNumber: 1} );

module.exports = mongoose.model('order', orderSchema );
