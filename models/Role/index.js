const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    default: '',
  },
  permissions: [{
    resource: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    attributes: {
      type: [{
        type: String,
      }],
    },
  }],
});

RoleSchema.index( {path: 1} );

module.exports = mongoose.model('role', RoleSchema);
