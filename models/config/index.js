const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const configSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Schema.Types.Mixed,
    default: '',
    unique: true,
  },
});

configSchema.index( {name: 1} );

module.exports = mongoose.model('config', configSchema);
