var mongoose = require('mongoose')

const Schema = mongoose.Schema

const RoleSchema = new Schema({
    role: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: "",
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
    }]
})

module.exports = mongoose.model('role', RoleSchema, 'roles')
