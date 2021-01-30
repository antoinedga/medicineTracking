const mongoose = require('mongoose')

// User Schema
const invitationSchema = new mongoose.Schema({
    invitation_token: {
        type: String,
        trim: true,
        required: true,
    },
    resetPasswordExpires: Date,
})

module.exports = mongoose.model('InvitationCode', invitationSchema)
