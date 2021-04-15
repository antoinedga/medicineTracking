const config = require('../../config');
const {Item} = require('../../models');
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

  inventoryExists(req.body.path, true)
      .then(() => newItem.save(callback(req, res, 'create item')))
      .catch((err) => sendError(req, res, err, 'create inventory'));
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
      .deleteOne({_id: req.body._id})
      .exec(callback(req, res, 'delete item by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
}
;
