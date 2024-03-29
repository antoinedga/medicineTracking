const {v1: uuidv1} = require('uuid');
const Order = require('../../models/order');
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../../config').secrets.jwtToken;

exports.get_placeOrder = (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      return res.json({
        response: false,
        message: 'An error occurred',
        content: null,
      });
    } else {
      return res.json({
        response: true,
        message: 'Place Order Page',
        content: null,
      });
    }
  });
};

exports.post_placeOrder = (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      return res.json({
        response: false,
        message: 'Forbidden',
        content: null,
      });
    } else {
      const generateOrderNumber = uuidv1();
      const newOrder = new Order({
        orderNumber: generateOrderNumber,
        orderDate: Date.now(),
        products: req.body.products,
        user_name: authData.user.name,
        user_id: authData.user._id,
      });
      newOrder.save((err, success) => {
        if (err) {
          console.log('Error creating order: ', err);
          return res.json({
            response: false,
            message: 'Error placing an order. Try again.',
            content: null,
          });
        }
        console.log('Order Created Successfully');
        return res.json({
          response: true,
          message: 'Order Created Successfully',
          content: success,
        });
      });
    }
  });
};

// Get page when user enters the Order Number.
exports.get_viewStoredOrder = (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      return res.json({
        response: false,
        message: 'Forbidden',
        content: null,
      });
    } else {
      return res.json({
        response: false,
        message: 'Order Lookup Page',
        content: null,
      });
    }
  });
};

// Post page when user enters the Order Number.
exports.post_viewStoredOrder = (req, res) => {
  try {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err) {
        return res.json({
          response: false,
          message: 'Forbidden',
          content: null,
        });
      }
      Order.findOne({orderNumber: req.body.orderNumber}, function(err, order) {
        if (err) {
          console.log(
              'No order found. Please check the order number and enter again.',
          );
          return res.json({
            response: false,
            message:
            'No order found. Please check the order number and enter again.',
            content: null,
          });
        } else {
          console.log(order);
          return res.json({
            response: true,
            message: 'View Order',
            content: order,
          });
        }
      });
    });
  } catch (err) {
    console.log('Error: ', err);
    return res.json({
      response: false,
      message: 'An error occurred. Please Login again.',
      content: null,
    });
  }
};

exports.get_updateOrder = (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      return res.json('Error: ', err);
    } else {
      res.json({
        message: 'Update Order Page',
      });
    }
  });
};

// This function updates Order by the order number.
exports.put_updateOrder = (req, res) => {
  try {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
      if (err) {
        return res.json('Forbidden');
      }
      Order.findOne({orderNumber: req.params.orderNumber}, (err, order) => {
        if (err) {
          console.log(err);
          return res.json({result: false,
            message: 'An err occurred',
            content: null,
          });
        } else {
          if (!order) {
            return res.json({result: false,
              message:
              'No order found. Check and enter the order number again.',
              content: null});
          }
          Order.updateOne(
              {
                'orderNumber': req.params.orderNumber,
                'products.product_name': req.body.product_name,
              },
              {
                $set: {
                  'products.$.total_quantity': req.body.total_quantity,
                },
              }, (err, updateOrder) => {
                if (err) {
                  console.log(err);
                  return res.json({result: false,
                    message: 'An err occurred',
                    content: null,
                  });
                } else {
                  console.log(updateOrder);
                  return res.json({result: true,
                    message: 'Order updated',
                    content: updateOrder,
                  });
                }
              });
        }
      });
    });
  } catch (err) {
    console.log('Error: ', err);
    return res.json('Error');
  }
}
;
