var mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    identifiers: {
        type: [{
            key: {
                type: String,
                required: true,
            },
            value: {
                type: String,
                required: true,
            }
        }],
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    eaches: {
        type: Schema.Types.ObjectId,
        ref: 'eaches',
    },
    additional_info: {
        type: Schema.Types.ObjectId,
        ref: 'additional_info',
    },
})

exports.Product = mongoose.model('product', productSchema)
exports.ProductSchema = productSchema