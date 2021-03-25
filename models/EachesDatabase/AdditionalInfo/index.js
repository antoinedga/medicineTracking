const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const additionalInfoSchema = new Schema({
  eaches_id: {
    type: Schema.Types.ObjectId,
    ref: 'eaches',
    required: true,
  },
  info: {
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
  score: {
    type: Number,
    required: true,
  },
});

exports.AdditionalInfo = mongoose.model(
    'additional_info',
    additionalInfoSchema,
);
exports.AdditionalInfoSchema = additionalInfoSchema
;
