const mongoose = require('mongoose');
const { ProductDefinitionSchema } = require('../ProductDefinition');
const { EachesStructureSchema } = require('../Eaches');
const { AdditionalInfoSchema } = require('../AdditionalInfo');

const Schema = mongoose.Schema;

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
      },
    }],
    required: true,
    _id: false,
  },
  productDefinition: ProductDefinitionSchema,
  eaches: {
    type: EachesStructureSchema,
  },
  additionalInfo: {
    type: AdditionalInfoSchema,
  },
}, { timestamps: true });

exports.Product = mongoose.model('product', productSchema);
exports.ProductSchema = productSchema;
