const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  role: {
    type: String,
    required: true,
    unique: true,
  },
  path: {
    type: String,
    default: '',
  },
  permissions: {
    type: [{
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
    _id: false,
  },
}, { timestamps: true });

RoleSchema.index({ path: 1 });
RoleSchema.index({ name: 1 });

module.exports = mongoose.model('role', RoleSchema);
