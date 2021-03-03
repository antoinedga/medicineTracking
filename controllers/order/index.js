const config=require('../../config');
const {Order, Inventory} = require('../../models');
const {callback} = require('../Callbacks');


/**
 * order:
 * {
 *    path: /<inv1>/<inv2>
 *    orderNumber:
 *    orderDate:
 *    user:
 *    items: [{
 *          product:
 *          quantity:
 *          desired:
 *      }]
 * }
 */

exports.getAll = (req, res) => {
  if (process.env.NODE_ENV === config.dev) {
    Order.find({}, callback(req, res, 'get all Orders'));
  } else {
    return res.status(401).json({message: 'Unauthorized user!'});
  }
};


exports.create = (req, res) => {
  const newOrder = new Order(req.body);

  Inventory
      .findOne({path: newOrder.path})
      .exec((err, inv) => {
        if (err) {
          return res
              .status(400)
              .json({
                response: false,
                message: `Error while checking if inventory exists`,
                Content: err,
              });
        } else {
          newOrder
              .save(callback(req, res, 'create order'))
          ;
        };
      });
};

exports.findRecursivelyByPath = (req, res) => {
  Order
      .find({path: new RegExp('^'+req.body.path)})
      .exec(callback(req, res, 'find orders by path'));
};

exports.findByPath = (req, res) => {
  Order
      .findOne({path: new RegExp('^'+req.body.path+'$')})
      .exec(callback(req, res, 'find orders by path'));
};

exports.findByID = (req, res) => {
  Order
      .findById(req.body._id)
      .exec(callback(req, res, 'find order by _id'));
};

exports.deleteRecursivelyByPath = (req, res) => {
  Order
      .deleteMany({path: new RegExp('^'+req.body.path)})
      .exec(callback(req, res, 'delete orders by path'));
};

exports.deleteByPath = (req, res) => {
  Order
      .deleteMany({path: new RegExp('^'+req.body.path+'$')})
      .exec(callback(req, res, 'delete orders by path'));
};

exports.deleteByID = (req, res) => {
  Order
      .deleteByID(req.body._id)
      .exec(callback(req, res, 'delete order by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
}
;
