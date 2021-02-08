const User = require('../models/user');
const { v1: uuidv1 } = require('uuid');
const Order = require('../models/order')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRETKEY
const verifyToken = require('../middlewareVerification/tokenVerification')

exports.get_placeOrder = (req, res) => {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if(err){
            return res.json('Error: ', err)
        }else{
            res.json({
                message: 'Place Order Page'
            })
        }
    });
}

exports.post_placeOrder = (req, res) => {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if(err){
            return res.json('Error: ', err)
        }else{
            generate_orderNumber = uuidv1()
            let new_Order = new Order({
                orderNumber: generate_orderNumber,
                orderDate: Date.now(),
                products: req.body.products,
                user: authData._id
            });
            new_Order.save((err, success) => {
                if(err){
                    console.log('Error creating order: ', err)
                    return res.json('Error creating order')
                }
                console.log('Order Created Successfully')
                return res.json('Order Created Successfully');
            })
        }
    });
}

// This function return Order details when user enters the Order Number.
exports.view_storedOrder = (req, res) => {
    try{
        jwt.verify(req.token, SECRET_KEY, (err, authData) => {
            if(err){
                return res.json('Forbidden')
            }
            Order.findOne({ orderNumber: req.body.orderNumber }, function(err, order) {
                if(err){
                    console.log('No order found. Please check the order number and enter again.');
                    return res.json('No order found. Please check the order number and enter again.');
                }else{
                    console.log("Order Number: " + order.orderNumber);
                    console.log("Date: " + order.orderDate);
                    console.log("Order Placed by: " + order.user_name);
                    console.log("User id: " + order.user_id)
                    console.log("Products: " + order.products);
                    return res.json(order);
                }
            });
        });
    }catch(err){
        console.log('Error: ', err)
        return res.json('Error')
    }

}
