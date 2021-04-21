const config = require('../../config');
const {Inventory, Role, Order, Item} = require('../../models');
const {callback} = require('../Callbacks');
const {getPathsObject, getCompletePaths, inventoryExists} = require('../utils');


/**
 * inventory:
 * {
 *    name: <inv2>,
 *    path: ,<inv1>,<inv2>,
 * }
 */

exports.getAll = (req, res) => {
  if (process.env.NODE_ENV === config.dev) {
    Inventory.find({}, callback(req, res, 'get all inventories'));
  } else {
    return res.status(401).json({message: 'Unauthorized user!'});
  }
};

exports.create = (req, res) => {
  if (!req.body.name) req.body.name = req.body.path.split('/').pop();
  const newInventory = new Inventory(req.body);

  inventoryExists(req.body.path, false)
      .then(() => newInventory.save(callback(req, res, 'create inventory')))
      .catch((err) => sendError(req, res, err, 'create inventory'));
};

exports.getPaths = (req, res) => {
  getPathsObject(req.auth.access, req.body.action, req.body.resource)
      .then((paths) => {
        return res
            .status(200)
            .json({
              response: true,
              message: `Successfully completed get path object`,
              content: paths,
            });
      }).catch((err) => {
        return res
            .status(400)
            .json({
              response: false,
              message: `Error during get path object`,
              content: err,
            });
      });
};

exports.getCompletePaths = (req, res) => {
  getCompletePaths(req.auth.access, req.body.action, req.body.resource)
      .then((paths) => {
        return res
            .status(200)
            .json({
              response: true,
              message: `Successfully completed get complete object`,
              content: paths,
            });
      }).catch((err) => {
        return res
            .status(400)
            .json({
              response: false,
              message: `Error during get complete path`,
              content: err,
            });
      });
};

exports.findRecursivelyByPath = (req, res) => {
  Inventory
      .find({path: new RegExp('^'+req.body.path)})
      .exec(callback(req, res, 'find inventories by path'));
};

exports.findByPath = (req, res) => {
  Inventory
      .find({path: new RegExp('^'+req.body.path+'$')})
      .exec(callback(req, res, 'find inventory by path'));
};

exports.findByID = (req, res) => {
  Inventory
      .findById(req.body._id)
      .exec(callback(req, res, 'find inventory by _id'));
};

exports.deleteRecursivelyByPath = (req, res) => {
  Order
      .deleteMany({path: new RegExp('^'+req.body.path)}).exec();
  Role
      .deleteMany({path: new RegExp('^'+req.body.path)}).exec();
  Item
      .deleteMany({path: new RegExp('^'+req.body.path)}).exec();
  Inventory
      .deleteMany({path: new RegExp('^'+req.body.path)})
      .exec(callback(req, res, 'delete inventories by path'));
};

exports.deleteByPath = (req, res) => {
  Inventory
      .deleteMany({path: new RegExp('^'+req.body.path+'$')})
      .exec(callback(req, res, 'delete inventory by path'));
};

exports.deleteByID = (req, res) => {
  Inventory
      .deleteOne({_id: req.body._id})
      .exec(callback(req, res, 'delete inventory by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
};
