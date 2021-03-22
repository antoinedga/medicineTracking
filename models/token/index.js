const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Invitation Schema
const tokenSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    trim: true,
    required: true,
  },
});

tokenSchema.index( {user: 1} );

module.exports = mongoose.model('token', tokenSchema);
