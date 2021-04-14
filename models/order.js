const mongoose = require('mongoose');
const config = require('../config');
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
      confirmedEaches: {
        type: Boolean,
        default: false,
      },
    }],
    required: true,
    _id: false,
  },
  status: {
    type: String,
    enum: config.custom.orderStatusOptions,
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
  currentLocation: {
    type: String,
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

orderSchema.index({path: 1});
orderSchema.index({orderNumber: 1});

module.exports = mongoose.model('order', orderSchema);
