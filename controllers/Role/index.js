// eslint-disable-next-line no-unused-vars
const {AccessControl, Query, Permission} = require('accesscontrol');
const {Roles} = require('../../models/Roles');
const User = require('../../models/user');
const camelCase = require('camelcase');

let ac = new AccessControl();

let roles = [
  {
    role: 'user:/inv1/inv2',
    path: '/inv1/inv2',
    resource: 'product:/inv1/inv2',
    action: 'read:own',
    attributes: ['*', '!price', '!_id'],
  },
  {
    role: 'admin:',
    path: '',
    resource: 'product:',
    action: 'read:any',
    attributes: ['*', '!price', '!_id'],
  },
  {
    role: 'user:/mlc',
    path: '/mlc',
    resource: 'product:/mlc/Outgoing',
    action: 'read:own',
    attributes: ['*', '!price', '!_id'],
  },
];

const dbRoles = [
  {
    role: 'user:/inv1/inv2',
    path: '/inv1/inv2',
    permissions: [
      {
        resource: 'product:/inv1/inv2',
        action: 'read:own',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
  {
    role: 'user:/inv1/inv2',
    path: '/inv1/inv2',
    permissions: [
      {
        resource: 'product:/inv1',
        action: 'read:any',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
  {
    role: 'admin:',
    path: '',
    permissions: [
      {
        resource: 'product:',
        action: 'read:any',
        attributes: ['*', '!price', '!_id'],
      },
      {
        resource: 'product:',
        action: 'create:any',
        attributes: ['*', '!price', '!_id'],
      },
      {
        resource: 'product:',
        action: 'update:any',
        attributes: ['*', '!price', '!_id'],
      },
      {
        resource: 'product:',
        action: 'delete:any',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
  {
    role: 'user:/mlc',
    path: '/mlc',
    permissions: [
      {
        resource: 'product:/mlc/Outgoing',
        action: 'read:own',
        attributes: ['*', '!price', '!_id'],
      },
    ],
  },
];


ac = new AccessControl(roles);

/*
    /mlc1/Outgoing|Orders|Inv|Outposts
*/
exports.createRole = (req, res) => {
  roles = grantsToRolls(req.body);

  Roles.insertMany(roles)
      .then(() => {
        return res.status(200).json({message: 'Role(s) successfully created'});
      })
      .catch(function(err) {
        res.status(400).send(err);
      });
};

/*
    {
        users: [<User._id>],
        roles: [<Role._id>]
    }
*/
exports.grantUserRole = (req, res) => {
  grant = req.body;

  User
      .updateMany(
          {_id: {$in: toArray(grant.users)}},
          {$addToSet: {roles: toArray(grant.roles)}},
      )
      .then( () => {
        return res.status(200).json({
          message: 'Users(s) successfully granted role(s)',
        });
      })
      .catch( (err) => {
        res.status(400).send(err);
      });
};

/**
 * Wraps any object in an array
 * @param {Any} value
 * @return {Array} [value]
 */
function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 * Turns Roles as received from DB into an array of Grants
 * @param {Array} dbRoles
 * @return {Array} grants
 */
function flattenDBRoles(dbRoles) {
  const _grants = [];
  dbRoles.forEach( (role) => {
    role.permissions.forEach( (permission) => {
      _grants.push(Object.assign(
          {role: role.role, path: role.path},
          permission,
      ));
    });
  });
  return _grants;
}

/**
 * converts and array of grant objects into Roles
 * @param {Array} grants
 * @return {Array<Role>} Roles - shape needed to store in DB
 */
function grantsToRolls(grants) {
  const _roles = [];
  Object.keys(grants).forEach( (role) => {
    path = role.split(':')[1];
    const _role = {role: role, path: path, permissions: []};

    Object.keys(grants[role]).forEach( (resource) => {
      Object.keys(grants[role][resource]).forEach( (action) => {
        path = resource.split(':')[1];
        _role.permissions.push({
          resource: resource,
          action: action,
          attributes: grants[role][resource][action],
        });
      });
    });

    _roles.push(_role);
  });
  return _roles;
}

/**
 * Checks if the query has permission to ACTION the RESOURCE.
 * Accounts for recursive permissions
 * @param {Query} _query
 * @param {String} action
 * @param {String} resource
 * @return {Permission} permission
 */
function can(_query, action, resource) {
  a = [action, 'own'];
  _resource = resource;

  let permission = _query[camelCase(a)](_resource);

  while (!permission.granted && _resource[_resource.length - 1] != ':') {
    _resource = _resource.replace(/\/\w*$/, '');
    permission = _query[action](_resource);
  }
  return permission;
}

/*
    action = 'read' | 'create' | 'update' | 'delete' | [ <action>]
    resource = 'inventory' | 'product' | ...
 */


exports.accessControl = (req, res, next) => {
  if (!req.user || !req.user.roles) {
    return res.status(401).json({
      response: false,
      message: `Unauthorized`,
      Content: null});
  };

  ac = new AccessControl(flattenDBRoles(req.user.roles));
  _roles = Object.keys(ac.getGrants());
  _query = ac.can(_roles);
  /**
     * Check if user can preform and action on a resource
     * @param {String} action - 'read' | 'create' | 'update' | 'delete'
     * @param {String} resource - '<resource>:<path>' - 'item:/mlc/shipping'
     * @return {Object} permission
     */
  req.user.can = (action, resource) => {
    return can(_query, action, resource);
  };
  next();
};
exports.getUserWithRolls = (userId) => {
  User
      .findById(userId).populate('roles')
      .then((doc) => {
        return doc;
      })
      .catch( () => {
        return null;
      });
};

exports.getAll = (req, res) => {
  if (process.env.NODE_ENV === config.dev) {
    Roles.find({}, (err, roles) => {
      if (err) {
        res.send(err);
      } else {
        res.json(roles);
      }
    });
  } else {
    return res.status(401).json({message: 'Unauthorized user!'});
  }
};

console.log(grantsToRolls(ac.getGrants()), dbRoles)
;
