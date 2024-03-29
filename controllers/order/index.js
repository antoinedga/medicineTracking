/* eslint-disable no-throw-literal */
const config = require('../../config');
const {Order} = require('../../models');
const {callback, sendError} = require('../Callbacks');
const csv = require('csv-parser');
const fs = require('fs');
const {action, resource} = require('../Role/enum');
const {doWork} = require('./utils');
const {
  inventoryExists,
  orderNumberExists,
} = require('../utils/checks');


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

  inventoryExists(req.body.path, true)
      .then(() => orderNumberExists(req.body.orderNumber, false))
      .then(() => newOrder.save(callback(req, res, 'create order')))
      .catch((err) => sendError(req, res, err, 'create order'));
};

exports.uploadOrderData = (req, res) => {
  try {
    if (
      !req.files ||
      !(req.files.orderData.mimetype == 'text/csv' ||
        req.files.orderData.mimetype == 'application/vnd.ms-excel') ||
      !req.body.orderNumber
    ) {
      return res
          .status(400)
          .json({
            response: false,
            message: `Error: requires a csv file and and orderNumber`,
            content: null,
          });
    }
    const file = req.files.orderData;
    const results = [];
    fs.createReadStream(file.tempFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', doWork(req, res, results, file.tempFilePath));
  } catch (err) {
    return res
        .status(500)
        .json({
          response: false,
          message: `Error ocurred while uploading order data`,
          content: err,
        });
  }
};


exports.updateByOrderNumber = (req, res) => {
  Order
      .findOneAndUpdate(
          {
            orderNumber: req.body?.orderNumber,
          },
          req.body,
          {
            setDefaultsOnInsert: true,
            useFindAndModify: false,
            new: true,
          })
      .exec(callback(req, res, 'update order by orderNumber'));
};

exports.updateByID = (req, res) => {
  Order
      .findOneAndUpdate(
          {
            _id: req.body?._id,
          },
          req.body,
          {
            setDefaultsOnInsert: true,
            useFindAndModify: false,
            new: true,
          },
      )
      .exec(callback(req, res, 'update order by id'));
};

exports.updateLogByID = (req, res) => {
  const obj = {};
  const msgs = [];
  if (req.body.message) {
    obj.currentLocation = req.body.currentLocation;
    msgs.push({message: req.body.message});
  }
  if (req.body.currentLocation) {
    obj.currentLocation = req.body.currentLocation;
    msgs.push({message: `Arrived at - ${req.body.currentLocation}`});
  }
  if (req.body.status) {
    obj.status = req.body.status;
    msgs.push({message: `Status updated to - ${req.body.status}`});
  }
  Order
      .findOneAndUpdate(
          {
            _id: req.body?._id,
          },
          {
            $set: obj,
            $push: {log: {$each: msgs}},
          },
          {
            setDefaultsOnInsert: true,
            useFindAndModify: false,
            new: true,
          },
      )
      .exec(callback(req, res, 'update order log by id'));
};

exports.updateLogByOrderNumber = (req, res) => {
  const obj = {};
  const msgs = [];
  if (req.body.message) {
    obj.currentLocation = req.body.currentLocation;
    msgs.push({message: req.body.message});
  }
  if (req.body.currentLocation) {
    obj.currentLocation = req.body.currentLocation;
    msgs.push({message: `Arrived at - ${req.body.currentLocation}`});
  }
  if (req.body.status) {
    obj.status = req.body.status;
    msgs.push({message: `Status updated to - ${req.body.status}`});
  }
  Order
      .findOneAndUpdate(
          {
            orderNumber: req.body?.orderNumber,
          },
          {
            $set: obj,
            $push: {log: {$each: msgs}},
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
        path: {
          $in: req.auth.permissions?.[action.DELETE]?.[resource.ORDER],
        },
      })
      .exec(callback(req, res, 'delete order by _id'));
};

exports.test = (req, res) => {
  console.log(req);
  return res.status(200).json({message: 'Success!'});
};

