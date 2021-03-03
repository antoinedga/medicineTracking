// eslint-disable-next-line new-cap
const router = require('express').Router();
const userRoute = require('./Authorization');
const adminRoute = require('./Authorization/admin');
const inventoryRoute = require('./Inventory');
const roleRoute = require('./Role');


module.exports = () => {
  router.use('/inventory', inventoryRoute());
  router.use('/user', userRoute());
  router.use('/admin', adminRoute);
  router.use('/role', roleRoute());

  router.get('*', (req, res) => {
    res.status(404).json({ message: 'not a route' });
  });

  return router;
};

