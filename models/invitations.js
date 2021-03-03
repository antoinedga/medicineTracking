const mongoose = require('mongoose');

// Invitation Schema
const invitationSchema = new mongoose.Schema({
  invitation_token: {
    type: String,
    trim: true,
    required: true,
  },
  invitationExpires: Date,
});

module.exports = mongoose.model('invitation_code', invitationSchema);
