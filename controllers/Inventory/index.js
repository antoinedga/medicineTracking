const config = require('../../config');
const {Inventory} = require('../../models');
const {callback} = require('../Callbacks');
const {getPathsObject, getCompletePaths} = require('../Role/utils');


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

  Inventory
      .findOne({path: newInventory.path})
      .exec((err, inv) => {
        if (err) {
          return res
              .status(400)
              .json({
                response: false,
                message: `Error while checking uniqueness of inventory path`,
                Content: err,
              });
        } else if (inv) {
          return res
              .status(400)
              .json({
                response: false,
                message: `Inventory: ${newInventory.path}, already exists`,
                Content: null,
              });
        } else {
          newInventory
              .save(callback(req, res, 'create inventory'))
          ;
        };
      });
};

exports.getPaths = (req, res) => {
  getPathsObject(req.auth.access, req.body.action, req.body.resource)
      .then((paths) => {
        return res
            .status(200)
            .json({
              response: true,
              message: `Successfully completed get path object`,
              Content: paths,
            });
      }).catch((err) => {
        return res
            .status(400)
            .json({
              response: false,
              message: `Error during get path object`,
              Content: err,
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
              Content: paths,
            });
      }).catch((err) => {
        return res
            .status(400)
            .json({
              response: false,
              message: `Error during get complete path`,
              Content: err,
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
      .findOne({path: new RegExp('^'+req.body.path+'$')})
      .exec(callback(req, res, 'find inventory by path'));
};

exports.findByID = (req, res) => {
  Inventory
      .findById(req.body._id)
      .exec(callback(req, res, 'find inventory by _id'));
};

exports.deleteRecursivelyByPath = (req, res) => {
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
      .deleteByID(req.body._id)
      .exec(callback(req, res, 'delete inventory by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
}
;
