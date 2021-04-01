
const config = require('../../config');
const {User, Inventory, Token} = require('../../models');
const {action} = require('../Role/enum/actions');
const {resource} = require('../Role/enum/resources');
const JWT = require('jsonwebtoken');

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
  dbRoles.forEach((role) => {
    role.permissions.forEach((permission) => {
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
  Object.keys(grants).forEach((role) => {
    let path = role.split(':')[1];
    const _role = {role: role, path: path, permissions: []};

    Object.keys(grants[role]).forEach((resource) => {
      Object.keys(grants[role][resource]).forEach((action) => {
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
  const paths = _query[resource][action];

  if (paths[path + '$']) return true;
  while (path.length > 0) {
    if (paths[path]) return true;
    path = path.replace(/\w*(\/)?$/, '');
  }

  return (paths[path]) ? true : false;
}

/**
 * Gets the list of paths where the query
 * has permission to ACTION the RESOURCE
 *
 * @param {*} _query
 * @param {*} action
 * @param {*} resource
 * @param {Boolean} regex default `false`
 * @return {Array} paths
 */
function getPaths(_query, action, resource, regex=false) {
  if (!_query[resource] || !_query[resource][action]) return [];

  const paths = Object.keys(_query[resource][action]);
  if (regex) {
    return paths.map((path) => {
      return new RegExp('^'+path);
    });
  }
  return paths;
}

/**
 * creates a path object containing all paths where the access query can preform
 * the given action on the given resource
 * @param {*} _query
 * @param {*} action
 * @param {*} resource
 */
async function getPathsObject(_query, action, resource) {
  const paths = getPaths(_query, action, resource, true);
  return await Inventory
      .find({
        'path': {
          '$in': paths,
        },
      })
      .then((invs) => {
        const paths = invs.map((inv) => {
          return inv.path;
        });

        const result = {};

        paths.forEach((path) => {
          let tmp = result;
          path = path.split('/');
          const len = path.length;
          path.forEach((name, idx) => {
            if (name) {
              if (tmp[name] === undefined) {
                tmp[name] = {can: false, next: {}};
              } if (idx == len-1) {
                tmp[name].can = true;
              }
              tmp = tmp[name].next;
            };
          });
        });
        return result;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
}

/**
 *
 * @param {*} _query
 * @param {*} action
 * @param {*} resource
 */
async function getCompletePaths(_query, action, resource) {
  const paths = getPaths(_query, action, resource, true);
  return await Inventory
      .find({
        'path': {
          '$in': paths,
        },
      })
      .then((invs) => {
        const paths = invs.map((inv) => {
          return inv.path;
        });
        return paths;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
}

/**
 * Combines roles in to a query object
 * @param {*} roles
 * @return {*} query
 */
function combine(roles) {
  const _query = {};
  roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      const _resource = permission.resource.split(':');
      const _action = permission.action.split(':');
      const _path = _resource[1] + ((_action[1] == 'own') ? '$' : '');

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
 * creates middleware that checks if the user has access to an action
 * on a resource.
 * @param {*} action
 * @param {*} resource
 * @return {*} middleware
 */
function requireAccess(action, resource) {
  return (req, res, next) => {
    const body = toArray(req.body);
    let err = false;
    body.forEach((doc) => {
      if (doc.path && !can(req.auth.access, action, resource, doc.path)) {
        err = true;
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
    if (err) return;
    const paths = getPaths(req.auth.access, action, resource);

    if (!req.auth.permissions) {
      req.auth.permissions = {};
    };
    if (!req.auth.permissions[action]) {
      req.auth.permissions[action] = {};
    };
    req.auth.permissions[action][resource] = new RegExp(paths);

    next();
  };
}
/**
 * creates an admin role with all permissions
 * @return {Object}
 */
function createAdminRole() {
  const _role = {
    role: 'admin:',
    path: '/',
    permissions: [],
  };

  Object.values(resource).forEach((r) => {
    Object.values(action).forEach((a) => {
      _role.permissions.push({
        resource: r + ':/',
        action: a + ':any',
      });
    });
  });
  return _role;
}
/**
 * create and a JWT for the given user
 * @param {*} userId
 */
async function createToken(userId) {
  const res = User
      .findById(userId).populate('roles')
      .then((user) => {
        const access = combine(user.roles);

        const token = JWT.sign(
            {
              user: {
                _id: user._id,
                name: user.name,
              },
              access,
            },
            config.secrets.jwtToken,
            {expiresIn: config.exp.jwtToken});

        return token;
      })
      .catch(() => {
        return null;
      });
  return res;
}

/**
 * Creates a JWT token and refresh token for the given user
 * @param {*} userId
 * @return {Promise<{token: String, refreshToken: String}>}
 */
async function createRefreshToken(userId) {
  const res = createToken(userId)
      .then((token) => {
        if (token == undefined) return null;

        const refreshToken = JWT.sign(
            {
              user: {
                _id: userId,
              },
            },
            config.secrets.jwtRefreshToken,
            {expiresIn: config.exp.jwtRefreshToken});

        return Token
            .findOneAndUpdate(
                {user: userId},
                {
                  user: userId,
                  refreshToken: refreshToken,
                },
                {
                  upsert: true,
                  setDefaultsOnInsert: true,
                  useFindAndModify: false,
                },
            )
            .then((doc) => {
              return {token, refreshToken};
            })
            .catch(() => {
              return null;
            });
      })
      .catch(() => {
        return null;
      });
  return res;
}

/**
 * verifies the refresh token and generates a new token
 * @param {*} refreshToken
 * @return {Promise<String>} new token
 */
async function verifyRefreshToken(refreshToken) {
  return JWT.verify(
      refreshToken,
      config.secrets.jwtRefreshToken,
      (err, decode) => {
        return Token
            .findOne({user: decode?.user?._id})
            .then((doc) => {
              if (doc?.refreshToken != refreshToken) return null;

              return createToken(decode.user._id)
                  .then((token) => {
                    return token;
                  })
                  .catch((err)=>{
                    return null;
                  });
            })
            .catch((err)=>{
              return null;
            });
      });
}
module.exports = {
  ...require('./checks'),
  combine,
  can,
  getPaths,
  getPathsObject,
  getCompletePaths,
  toArray,
  flattenDBRoles,
  grantsToRolls,
  requireAccess,
  createAdminRole,
  createToken,
  createRefreshToken,
  verifyRefreshToken,
};


