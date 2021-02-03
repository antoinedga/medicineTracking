var mongoose = require('mongoose')

var { eachesSchema } = require('../Eaches')

const Schema = mongoose.Schema

exports.productSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    identifiers: {
        type: [{
            key: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }],
    },
    eaches: {
        type: eachesSchema,
        }
})

exports.Product = mongoose.model('product', productSchema)
