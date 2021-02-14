var Role = require('../../models/Roles')
var {Access, AccessControl, AccessControlError, Permission, Query } = require('accesscontrol')
const {Roles, UserRoles} = require('../../models/Roles')
const User = require('../../models/user')
const camelCase = require('camelcase');

let ac = new AccessControl()

let roles = [
    { role: 'user:/inv1/inv2', location: '/inv1/inv2', resource: 'product:/inv1/inv2', action: 'read:own', attributes: [ '*', '!price', '!_id']},
    { role: 'admin:', location: '', resource: 'product:', action: 'read:any', attributes: [ '*', '!price', '!_id']},
    { role: 'user:/mlc', location: '/mlc', resource: 'product:/mlc/Outgoing', action: 'read:own', attributes: [ '*', '!price', '!_id']}           
]

let dbRoles = [
    { role:'user:/inv1/inv2', location: '/inv1/inv2', permissions: [ {resource: 'product:/inv1/inv2', action: 'read:own', attributes: [ '*', '!price', '!_id'],}] },
    { role:'user:/inv1/inv2', location: '/inv1/inv2', permissions: [ {resource: 'product:/inv1', action: 'read:any', attributes: [ '*', '!price', '!_id'],}] },
    { role: 'admin:', location: '', permissions: [ { resource: 'product:', action: 'read:any', attributes: [ '*', '!price', '!_id']},
                                                { resource: 'product:', action: 'create:any', attributes: [ '*', '!price', '!_id']},
                                                { resource: 'product:', action: 'update:any', attributes: [ '*', '!price', '!_id']},
                                                { resource: 'product:', action: 'delete:any', attributes: [ '*', '!price', '!_id']},
                                            ]},
    { role: 'user:/mlc', location: '/mlc', permissions: [ {resource: 'product:/mlc/Outgoing', action: 'read:own', attributes: [ '*', '!price', '!_id']}]},
]

ac = new AccessControl(roles)

/*
    /mlc1/Outgoing|Orders|Inv|Outposts
*/
exports.createRole = (req,res) => {
    roles = GrantsToRolls(req.body)

    Roles.insertMany(roles)
        .then((docs) => {
            return res.status(200).json({ message: 'Role(s) successfully created' })
        })
        .catch(function (err) {
            response.status(400).send(err);
        });
}

/*
    {
        users: [<User._id>],
        roles: [<Role._id>]
    }
*/
exports.grantUserRole = (req,res) => {
    grant = req.body

    User
        .updateMany(
            {_id: {$in: toArray(grant.users)}},
            { $addToSet: { roles: toArray(grant.roles) } }
        )
        .then( docs => {
            return res.status(200).json({ message: 'Users(s) successfully granted role(s)' })
        })
        .catch( err => {
            response.status(400).send(err);
        });
}

function toArray(value) {
    if (!value) return []
    if (Array.isArray(value)) return value;
    return [value];
}

function FlattenDBRoles(dbRoles) {
    let _grants = []
    dbRoles.forEach( role => {
            role.permissions.forEach( permission => {
                _grants.push(Object.assign({role: role.role, location: role.location}, permission))
            })
    })
    return _grants
}

function GrantsToRolls(grants) {
    let _roles = []
    Object.keys(grants).forEach( role => {
        location = role.split(':')[1]
        let _role = {role: role,location: location, permissions: []}

        Object.keys(grants[role]).forEach( resource => {
            Object.keys(grants[role][resource]).forEach( action => {
                location = resource.split(':')[1]
                _role.push({resource: resource, action: action, attributes: grants[role][resource][action]})
            })
        })

        _roles.push(_role)
    })
    return _roles
}

function can(ac,role,action,resource) {
    _query = ac.can(role)
    a = action.split(':')
    _action = a[0] 
    _resource = resource

    var permission = _query[camelCase(a)](_resource)

    while (!permission.granted &&  _resource[_resource.length - 1] != ':') {
        _resource = _resource.replace(/\/\w*$/,'')
        permission = _query[_action](_resource)
    }
    return permission
}

/*
    action = 'read' | 'create' | 'update' | 'delete' | [ <action>]
    resource = 'inventory' | 'product' | ...
 */
exports.requireAccess = (action, resource) => {
    return (req, res, next) => {
        res.user.roles
    }
}

exports.getUserWithRolls = (userId) => {
    User
        .findById(userId).populate('roles')
        .then(doc => {
            return doc
        })
        .catch( err => {
            return null
        });
}

exports.getAll = (req, res) => {
    if (process.env.NODE_ENV === config.dev) {
      Roles.find({}, (err, roles) => {
        if (err) {
          res.send(err)
        } else {
          res.json(roles)
        }
      })
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' })
    }
  }

console.log(GrantsToRolls(ac.getGrants()))