const mongoose = require('mongoose');

// Invitation Schema
const invitationSchema = new mongoose.Schema({
  invitationToken: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  invitationExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('invitationCode', invitationSchema);
