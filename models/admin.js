const mongoose = require('mongoose')

// User Schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
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
    }
}, {timestamps: true})

module.exports = mongoose.model('Admin', adminSchema)
