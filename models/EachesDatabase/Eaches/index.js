var mongoose = require('mongoose')

const Schema = mongoose.Schema

const eachesSchema = new Schema({
  product_definition_id: {
    type: Schema.Types.ObjectId,
    ref: 'product_definition',
  },
  eaches: {
    type: [{
        quantity: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
        }
    }],
    required: true,
  },
  score: {
    type: Number,
    required: true
  },
})

exports.Eaches = mongoose.model('eaches', eachesSchema)
exports.EachesSchema = eachesSchema