const config = require('../../config');
const {Item, Inventory} = require('../../models');
const {callback} = require('../Callbacks');


/**
 * item:
 * {
 *    path: /<inv1>/<inv2>
 *    product:
 *    quantity:
 * }
 */

exports.getAll = (req, res) => {
  if (process.env.NODE_ENV === config.dev) {
    Item.find({}, callback(req, res, 'get all Items'));
  } else {
    return res.status(401).json({message: 'Unauthorized user!'});
  }
};


exports.create = (req, res) => {
  const newItem = new Item(req.body);

  Inventory
      .findOne({path: newItem.path})
      .exec((err, inv) => {
        if (err) {
          return res
              .status(400)
              .json({
                response: false,
                message: `Error while checking if inventory exists`,
                Content: err,
              })
          ;
        } else {
          newItem
              .save(callback(req, res, 'create item'))
          ;
        };
      });
};

exports.findRecursivelyByPath = (req, res) => {
  Item
      .find({path: new RegExp('^'+req.body.path)})
      .exec(callback(req, res, 'find items by path'));
};

exports.findByPath = (req, res) => {
  Item
      .find({path: new RegExp('^'+req.body.path+'$')})
      .exec(callback(req, res, 'find items by path'));
};

exports.findByID = (req, res) => {
  Item
      .findById(req.body._id)
      .exec(callback(req, res, 'find item by _id'));
};

exports.deleteRecursivelyByPath = (req, res) => {
  Item
      .deleteMany({path: new RegExp('^'+req.body.path)})
      .exec(callback(req, res, 'delete items by path'));
};

exports.deleteByPath = (req, res) => {
  Item
      .deleteMany({path: new RegExp('^'+req.body.path+'$')})
      .exec(callback(req, res, 'delete items by path'));
};

exports.deleteByID = (req, res) => {
  Item
      .deleteByID(req.body._id)
      .exec(callback(req, res, 'delete item by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
}
;
