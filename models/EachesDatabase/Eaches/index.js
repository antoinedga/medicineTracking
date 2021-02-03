var mongoose = require('mongoose')

const Schema = mongoose.Schema

exports.eachesSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'product',
  },
  eaches: {
    type: [{
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }],
  },
  score: {
    type: Number,
    required: true
  },
})

exports.Eaches = mongoose.model('eaches', eachesSchema)
