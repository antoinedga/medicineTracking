var mongoose = require('mongoose')

const Schema = mongoose.Schema

const productDefinitionSchema = new Schema({
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
    }
})

exports.ProductDefinition = mongoose.model('product_definition', productDefinitionSchema)
exports.ProductDefinitionSchema = productDefinitionSchema