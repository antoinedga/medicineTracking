const config=require('../../config');
const {Order, Inventory} = require('../../models');
const {callback} = require('../Callbacks');
const csv = require('csv-parser');
const fs = require('fs');


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
      console.log(req.files, req.body);
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
          // [
          //   { NAME: 'Daffy Duck', AGE: '24' },
          //   { NAME: 'Bugs Bunny', AGE: '22' }
          // ]
          return res
              .status(200)
              .json({
                response: true,
                message: `Successfully uploaded order data`,
                Content: results,
              });
        });
    fs.unlink(file.tempFilePath, ()=>{});
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
 * @param {[*]} data
 */
async function updateOrderData(orderNumber, data) {
  const products = data.map((product) => {
    return Object.entries(product).map(([key, value]) => {
      return {key, value};
    });
  });
  const session = await Order.db.startSession();
  session.startTransaction();

  Order
      .findOne({orderNumber})
      .then((doc) => {

      });

  session.endSession();
}

exports.updateByID = (req, res) => {
  Order
      .findByIdAndUpdate({_id: req.body?._id}, req.body)
      .exec(callback(req, res, 'find orders by path'));
};

exports.findRecursivelyByPath = (req, res) => {
  Order
      .find({path: new RegExp('^'+req.body.path)})
      .exec(callback(req, res, 'find orders by path'));
};

exports.findByPath = (req, res) => {
  Order
      .find({path: new RegExp('^'+req.body.path+'$')})
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
