const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eachesStructureSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  _id: false,
});
eachesStructureSchema.add({contains: [eachesStructureSchema]});

const eachesSchema = new Schema({
  productDefinition: {
    type: Schema.Types.ObjectId,
    ref: 'productDefinition',
  },
  eaches: {
    type: eachesStructureSchema,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

eachesSchema.index( {productDefinition: 1, score: -1} );

exports.Eaches = mongoose.model('eaches', eachesSchema);
exports.EachesSchema = eachesSchema;


