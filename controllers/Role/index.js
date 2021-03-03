const {Role} = require('../../models');
const User = require('../../models/user');
const {callback} = require('../Callbacks');
const utils = require('./utils');
const config = require('../../config');

/**
 *
 */
function createAdmin() {
  Role.findOneAndUpdate(
      {role: 'admin:'},
      utils.createAdminRole(),
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
          name: 'admin',
          email: 'admin',
          password: 'admin',
          roles: [doc._id],
        },
        {upsert: true,
          setDefaultsOnInsert: true,
          useFindAndModify: false},
    ).exec((err, doc) => {
      if (err) return console.log(err);
      console.log('successfully created an admin');
    });
  });
}
createAdmin();

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
exports.createRole = (req, res) => {
  roles = req.body;

  Role.insertMany(roles)
      .then(callback(req, res, 'create role(s)'));
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
          {_id: {$in: utils.toArray(grant.users)}},
          {$addToSet: {roles: utils.toArray(grant.roles)}},
      )
      .then(callback(req, res, 'grant role(s)'));
};


/*
    action = 'read' | 'create' | 'update' | 'delete' | [ <action>]
    resource = 'inventory' | 'product' | ...
 */


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


