// eslint-disable-next-line new-cap
const router = require('express').Router();
const userRoute = require('./Authorization');
const adminRoute = require('./Authorization/admin');
const inventoryRoute = require('./Inventory');


module.exports = () => {
  router.use('/inventory', inventoryRoute());
  router.use('/user', userRoute);
  router.use('/admin', adminRoute);

  router.get('*', (req, res) => {

  });

  return router;
};

