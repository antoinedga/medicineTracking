// eslint-disable-next-line new-cap
const router = require('express').Router();
const userRoute = require('./Authorization');
const adminRoute = require('./Authorization/admin');
const inventoryRoute = require('./Inventory');
const roleRoute = require('./Role');
const orderRoute = require('./order');
const configRoute = require('./config');
const productRoute = require('./product');
const itemRoute = require('./Item');


module.exports = () => {
  router.use('/inventory', inventoryRoute());
  router.use('/user', userRoute());
  router.use('/admin', adminRoute());
  router.use('/role', roleRoute());
  router.use('/order', orderRoute());
  router.use('/config', configRoute());
  router.use('/product', productRoute());
  router.use('/item', itemRoute() );

  router.get('*', (req, res) => {
    res.status(404).json({message: 'not a route'});
  });

  return router;
};

