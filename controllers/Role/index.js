const {Role} = require('../../models');
const User = require('../../models/user');
const {callback} = require('../Callbacks');
const utils = require('../utils');
const config = require('../../config');
const {action} = require('./enum/actions');
const {resource} = require('./enum/resources');
const {objectToRolls, rollsToObjects} = require('../utils');

/**
 * creates and admin with access to all actions
 * @param {String} name
 * @param {String} path
 * @param {String} email - form - `xxxx@xxxx.xxx`
 * @param {String} password
 */
function createAdmin(name, path, email, password) {
  Role.findOneAndUpdate(
      {role: `${name}:${path}`},
      utils.createAdminRole(name, path),
      {
        upsert: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
        new: true,
      },
  ).exec((err, doc) => {
    if (err) return console.log(err);
    User.findOneAndUpdate(
        {email},
        {
          name,
          email,
          password,
          roles: [doc._id],
        },
        {
          upsert: true,
          setDefaultsOnInsert: true,
          useFindAndModify: false,
        },
    ).exec((err, doc) => {
      if (err) return console.log(err);
      console.log('successfully created an admin');
    });
  });
}

createAdmin('admin', '/', 'admin1@admin.com', 'admin123');

exports.getAll = (req, res) => {
  if (process.env.NODE_ENV === config.dev) {
    Role.find({}, callback(req, res, 'get all roles'));
  } else {
    return res.status(401).json({message: 'Unauthorized user!'});
  }
};
/*
    /mlc1/Outgoing|Orders|Inv|Outposts
*/
exports.create = (req, res) => {
  console.log(JSON.stringify(req.body, null, 1), 'zz');
  roles = objectToRolls(req.body);

  Role.insertMany(roles, callback(req, res, 'create role(s)'));
};

/*
    {
        user: [<User._id>],
        role: [<Role._id>]
    }
*/
exports.grantUserRole = (req, res) => {
  grant = req.body;

  User
      .updateMany(
          {_id: {$in: utils.toArray(grant.user)}},
          {$set: {roles: utils.toArray(grant.role)}},
          callback(req, res, 'grant role(s)'),
      );
};


exports.findRecursivelyByPath = (req, res) => {
  Role
      .find({path: new RegExp('^' + req.body.path)})
      .exec(callback(req, res, 'find roles by path', rollsToObjects));
};

exports.findByPath = (req, res) => {
  Role
      .find({path: new RegExp('^' + req.body.path + '$')})
      .exec(callback(req, res, 'find roles by path', rollsToObjects));
};

exports.findByID = (req, res) => {
  Role
      .findById(req.body._id)
      .exec(callback(req, res, 'find role by _id', rollsToObjects));
};

exports.updateByID = (req, res) => {
  console.log('->', req.body);
  const role = objectToRolls(req.body)[0];

  Role.findOneAndUpdate(
      {
        _id: req.body?._id,
      },
      {
        $set: role,
      },
      {
        setDefaultsOnInsert: true,
        useFindAndModify: false,
        new: true,
      },
  )
      .exec(callback(req, res, 'update role by id'));
};

exports.deleteRecursivelyByPath = (req, res) => {
  Role
      .deleteMany({path: new RegExp('^' + req.body.path)})
      .exec(callback(req, res, 'delete roles by path'));
};

exports.deleteByPath = (req, res) => {
  Role
      .deleteMany({path: new RegExp('^' + req.body.path + '$')})
      .exec(callback(req, res, 'delete roles by path'));
};

exports.deleteByID = (req, res) => {
  Role
      .deleteOne({_id: req.body._id})
      .exec(callback(req, res, 'delete role by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
};

exports.getUsersWithRoles = (req, res) => {
  User
      .find({}, {password: 0})
      .populate('roles', '_id role')
      .then((doc) => {
        doc?.forEach((user) => {
          user?.roles?.forEach((role, index) => {
            const [name, path] = role.role.split(':');
            user.roles[index] = {
              _id: role._id,
              name,
              path,
            };
          });
        });
        callback(req, res, 'get users with roles')(undefined, doc);
      })
      .catch(callback(req, res, 'get users with roles'));
};


exports.getUserWithRolls = (userId) => {
  User
      .findById(userId).populate('roles')
      .then((doc) => {
        return doc;
      })
      .catch(() => {
        return null;
      });
};


exports.getActions = (req, res) => {
  callback(
      req,
      res,
      `get actions ${req.params.name}`,
  )(null, Object.values(action));
};

exports.getResources = (req, res) => {
  callback(
      req,
      res,
      `get actions ${req.params.name}`,
  )(null, Object.values(resource));
};
