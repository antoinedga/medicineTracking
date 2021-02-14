var mongoose = require('mongoose')

const Schema = mongoose.Schema

const userRolesSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'user',
    },
    roles: {
        type: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'role',
            }
        ],
    },
})

module.exports = mongoose.model('user_roles', userRolesSchema, 'roles')
