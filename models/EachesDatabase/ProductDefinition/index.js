const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
      },
    }],
    required: true,
    _id: false,
  },
  _nGrams: {
    type: String,
    required: true,
  },
  _prefixNGrams: {
    type: String,
    required: true,
  },
});

productDefinitionSchema.index({identifiers: 1});
productDefinitionSchema.index( {
  _nGrams: 'text',
  _prefixNGrams: 'text',
},
{
  weights: {
    _nGrams: 10,
    _prefixNGrams: 20,
  },
  name: 'nGramIndex',
} );

exports.ProductDefinition = mongoose.model(
    'productDefinition',
    productDefinitionSchema,
);
exports.ProductDefinitionSchema = productDefinitionSchema;
