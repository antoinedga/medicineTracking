/* eslint-disable no-throw-literal */
const config = require('../../config');
const {Order, Inventory} = require('../../models');
const {callback} = require('../Callbacks');
const csv = require('csv-parser');
const fs = require('fs');
const {action, resource} = require('../Role/enum');
const {combineProductsAndDesiredItems} = require('./utils');
const {createProductDefinitionUsingNdc} = require('../Eaches');


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
  if (!req.body?.user) req.body.user = req.auth.user._id;
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

exports.uploadOrderData = (req, res) => {
  try {
    if (
      !req.files ||
      req.files.orderData.mimetype != 'text/csv' ||
      !req.body.orderNumber
    ) {
      return res
          .status(400)
          .json({
            response: false,
            message: `Error: requires a csv file and and orderNumber`,
            Content: null,
          });
    }
    const file = req.files.orderData;
    const results = [];
    fs.createReadStream(file.tempFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          updateOrderData(req.body.orderNumber, results)
              .then((doc) => {
                return res
                    .status(200)
                    .json(doc);
              })
              .catch((err) => {
                console.log('error', err);
                return res
                    .status(400)
                    .json({
                      response: false,
                      message: `Error ocurred while saving uploaded order data`,
                      Content: err,
                    });
              });
        });
    fs.unlink(file.tempFilePath, () => { });
  } catch (err) {
    return res
        .status(500)
        .json({
          response: false,
          message: `Error ocurred while uploading order data`,
          Content: err,
        });
  }
};
/**
 *
 * @param {String} orderNumber
 * @param {[*]} orderData
 */
async function updateOrderData(orderNumber, orderData) {
  return Order
      .findOne({orderNumber})
      .then((doc) => {
        if (doc == undefined) {
          throw new Error('No matching order');
        }
        console.log(doc.items);
        doc.items = combineProductsAndDesiredItems(orderData, doc.items);
        createProductDefinitionUsingNdc(orderData);
        return doc.save();
      })
      .then((doc) => {
        return {
          response: true,
          message: `Successfully updated order`,
          Content: doc,
        };
      })
      .catch((err) => {
        return {
          response: false,
          message: `Error while updating order`,
          Content: err,
        };
      });
}

exports.updateByID = (req, res) => {
  Order
      .findOneAndUpdate({
        _id: req.body?._id,
      }, req.body)
      .exec(callback(req, res, 'update order by id'));
};

exports.updateLogByID = (req, res) => {
  Order
      .findOneAndUpdate(
          {
            _id: req.body?._id,
          },
          {
            $push: {log: {message: req.body?.message}},
          },
          {
            setDefaultsOnInsert: true,
            useFindAndModify: false,
          },
      )
      .exec(callback(req, res, 'update order log by id'));
};

exports.updateLogByOrderNumber = (req, res) => {
  console.log(req.auth.permissions[action.UPDATE][resource.ORDER]);
  Order
      .findOneAndUpdate(
          {
            orderNumber: req.body?.orderNumber,
          },
          {
            $push: {log: {message: req.body?.message}},
          },
          {
            setDefaultsOnInsert: true,
            useFindAndModify: false,
          },
      )
      .exec(callback(req, res, 'update order log by orderNumber'));
};

exports.findRecursivelyByPath = (req, res) => {
  Order
      .find({path: new RegExp('^' + req.body.path)})
      .populate('user', ['_id', 'name'])
      .exec(callback(req, res, 'find orders by path'));
};

exports.findByPath = (req, res) => {
  Order
      .find({path: new RegExp('^' + req.body.path + '$')})
      .populate('user', ['_id', 'name'])
      .exec(callback(req, res, 'find orders by path'));
};

exports.findByID = (req, res) => {
  Order
      .findById({
        _id: req.body._id,
        path: {$in: req.auth.permissions[action.READ][resource.ORDER]},
      })
      .populate('user', ['_id', 'name'])
      .exec(callback(req, res, 'find order by _id'));
};

exports.deleteRecursivelyByPath = (req, res) => {
  Order
      .deleteMany({path: new RegExp('^' + req.body.path)})
      .exec(callback(req, res, 'delete orders by path'));
};

exports.deleteByPath = (req, res) => {
  Order
      .deleteMany({path: new RegExp('^' + req.body.path + '$')})
      .exec(callback(req, res, 'delete orders by path'));
};

exports.deleteByID = (req, res) => {
  Order
      .deleteOne({
        _id: req.body._id,
        path: {$in: req.auth.permissions[action.DELETE][resource.ORDER]},
      })
      .exec(callback(req, res, 'delete order by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
};
