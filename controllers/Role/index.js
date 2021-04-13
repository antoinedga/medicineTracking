const {Role} = require('../../models');
const User = require('../../models/user');
const {callback} = require('../Callbacks');
const utils = require('../utils');
const config = require('../../config');
const {action} = require('./enum/actions');
const {resource} = require('./enum/resources');

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
        {_id: '111111111111111111111111'},
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

createAdmin('admin', '/', 'admin@admin.com', 'admin123');

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
  roles = req.body;

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
          {$addToSet: {roles: utils.toArray(grant.role)}},
          callback(req, res, 'grant role(s)'),
      );
};


exports.findRecursivelyByPath = (req, res) => {
  Role
      .find({path: new RegExp('^' + req.body.path)})
      .exec(callback(req, res, 'find roles by path'));
};

exports.findByPath = (req, res) => {
  Role
      .find({path: new RegExp('^' + req.body.path + '$')})
      .exec(callback(req, res, 'find roles by path'));
};

exports.findByID = (req, res) => {
  Role
      .findById(req.body._id)
      .exec(callback(req, res, 'find role by _id'));
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
      .deleteByID(req.body._id)
      .exec(callback(req, res, 'delete role by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
};

exports.getUsersWithRoles = (req, res) => {
  User
      .find({}, {password: 0})
      .populate('roles', 'role path')
      .exec(callback(req, res, 'get users with roles'));
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
