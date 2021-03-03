
const config = require('../../../config');
const {User} = require('../../../models');
const {action} = require('../enum/actions');
const {resource} = require('../enum/resources');
const jwt = require('jsonwebtoken');

// const roles = [
//   {
//     role: 'user:/inv1/inv2',
//     path: '/inv1/inv2',
//     resource: 'product:/inv1/inv2',
//     action: 'read:own',
//     attributes: ['*', '!price', '!_id'],
//   },
//   {
//     role: 'admin:',
//     path: '',
//     resource: 'product:',
//     action: 'read:any',
//     attributes: ['*', '!price', '!_id'],
//   },
//   {
//     role: 'user:/mlc',
//     path: '/mlc',
//     resource: 'product:/mlc/Outgoing',
//     action: 'read:own',
//     attributes: ['*', '!price', '!_id'],
//   },
// ];

// const dbRoles = [
//   {
//     role: 'user:/h/inv1/inv2',
//     path: '/h/inv1/inv2',
//     permissions: [
//       {
//         resource: 'product:/h/inv1/inv2',
//         action: 'read:own',
//         attributes: ['*', '!price', '!_id'],
//       },
//     ],
//   },
//   {
//     role: 'user:/h/inv1',
//     path: '/h/inv1',
//     permissions: [
//       {
//         resource: 'product:/h/inv1',
//         action: 'read:any',
//         attributes: ['*', '!price', '!_id'],
//       },
//     ],
//   },
//   {
//     role: 'admin:/h',
//     path: '/h',
//     permissions: [
//       {
//         resource: 'product:/h',
//         action: 'read:own',
//         attributes: ['*', '!price', '!_id'],
//       },
//       {
//         resource: 'product:/h',
//         action: 'create:any',
//         attributes: ['*', '!price', '!_id'],
//       },
//       {
//         resource: 'product:/h',
//         action: 'update:any',
//         attributes: ['*', '!price', '!_id'],
//       },
//       {
//         resource: 'product:/h',
//         action: 'delete:any',
//         attributes: ['*', '!price', '!_id'],
//       },
//     ],
//   },
//   {
//     role: 'user:/h/mlc',
//     path: '/h/mlc',
//     permissions: [
//       {
//         resource: 'product:/h/mlc/Outgoing',
//         action: 'read:own',
//         attributes: ['*', '!price', '!_id'],
//       },
//     ],
//   },
// ];


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
 * Checks if the query has permission to ACTION the RESOURCE at PATH
 * Accounts for recursive permissions
 * @param {Object} _query
 * @param {String} action
 * @param {String} resource
 * @param {String} path
 * @return {Boolean} permission
 */
function can(_query, action, resource, path) {
  if (!_query?.[resource]?.[action]) return false;

  paths =_query[resource][action];

  if (paths[path+'$']) return true;
  while (path.length > 0) {
    // console.log(path, paths[path], paths[path+'$']);
    if (paths[path]) return true;
    path = path.replace(/\/\w*$/, '');
  }

  return (paths[path])? true : false;
}

/**
 * Gets the list of paths where the query
 * has permission to ACTION the RESOURCE
 *
 * @param {*} _query
 * @param {*} action
 * @param {*} resource
 * @return {Array} paths
 */
function getPaths(_query, action, resource) {
  if (!_query[resource] || !_query[resource][action]) return [];

  return Object.keys(_query[resource][action]);
}

/**
 * Combines roles in to a query object
 * @param {*} roles
 * @return {*} query
 */
function combine(roles) {
  _query = {};
  roles.forEach( (role) => {
    role.permissions.forEach( (permission) => {
      _resource = permission.resource.split(':');
      _action = permission.action.split(':');
      _path = _resource[1] + ((_action[1] == 'own')? '$':'');

      if (!_query[_resource[0]]) {
        _query[_resource[0]] = {};
      }
      if (!_query[_resource[0]][_action[0]]) {
        _query[_resource[0]][_action[0]] = {};
      }
      if (!_query[_resource[0]][_action[0]][_path]) {
        _query[_resource[0]][_action[0]][_path] = {};
      }
    });
  });
  return _query;
}

/*
    action = 'read' | 'create' | 'update' | 'delete' | [ <action>]
    resource = 'inventory' | 'product' | ...
 */

/**
 *
 * @param {*} action
 * @param {*} resource
 * @return {*} middleware
 */
function requireAccess(action, resource) {
  return (req, res, next) => {
    const body = toArray(req.body);
    body.forEach((doc) => {
      if (doc.path && !can(req.auth.access, action, resource, doc.path)) {
        return res
            .status(401)
            .json({
              response: false,
              message:
                `Unauthorized: cannot ${action} ${resource} at ${doc.path}`,
              Content: null,
            });
      }
    });

    paths = getPaths(req.auth.access, action, resource);

    if (!req.auth.permissions) {
      req.auth.permissions = {};
    };
    if (!req.auth.permissions[action]) {
      req.auth.permissions[action] = {};
    };
    req.auth.permissions[action][resource] = paths;

    next();
  };
}
/**
 *
 * @return {Object}
 */
function createAdminRole() {
  _role = {
    role: 'admin:',
    path: '',
    permissions: [],
  };

  Object.values(resource).forEach((r) => {
    Object.values(action).forEach((a) => {
      _role.permissions.push({
        resource: r+':',
        action: a+':any',
      });
    });
  });

  return _role;
}
/**
 *
 * @param {*} userId
 */
async function createToken(userId) {
  const res = User
      .findById(userId).populate('roles')
      .then((user) => {
        access = combine(user.roles);

        const token = jwt.sign({
          user: {
            _id: user._id,
            name: user.name,
          },
          access,
        }, config.secrets.jwt);

        return token;
      })
      .catch( () => {
        return null;
      });
  return res;
}

module.exports = {
  combine,
  can,
  getPaths,
  toArray,
  flattenDBRoles,
  grantsToRolls,
  requireAccess,
  createAdminRole,
  createToken,
};


