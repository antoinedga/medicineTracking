const mongoose = require('mongoose')
const crypto = require('crypto')

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 64
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'role',
            }
        ],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema)
