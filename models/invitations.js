const mongoose = require('mongoose')

// User Schema
const invitationSchema = new mongoose.Schema({
    invitation_code: {
        type: String,
        trim: true,
        required: true,
    },
})

module.exports = mongoose.model('InvitationCode', invitationSchema)
