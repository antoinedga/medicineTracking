// eslint-disable-next-line new-cap
const router = require('express').Router();
const order = require('../../controllers/order');
const {requireLogin} =require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/utils');
const {action, resource} = require('../../controllers/Role/enum');

module.exports = () => {
  router.get('/test', order.test);

  router.route('/')
      .get(order.getAll)
      .post(
          requireLogin,
          requireAccess(action.CREATE, resource.ORDER),
          order.create,
      );

  router.route('/upload')
      .post(
          requireLogin,
          requireAccess(action.UPDATE, resource.ORDER),
          order.uploadOrderData,
      );

  router.route('/by_id')
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ORDER),
          order.findByID,
      )
      .put(
          requireLogin,
          requireAccess(action.UPDATE, resource.ORDER),
          order.updateByID,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ORDER),
          order.deleteByID,
      );
  router.route('/by_id/log')
      .put(
          requireLogin,
          requireAccess(action.UPDATE, resource.ORDER),
          order.updateLogByID,
      );
  router.route('/by_order_number/log')
      .put(
          requireLogin,
          requireAccess(action.UPDATE, resource.ORDER),
          order.updateLogByOrderNumber,
      );

  router.route('/by_path')
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ORDER),
          order.findByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ORDER),
          order.deleteByPath,
      );

  router.route('/by_path/recursive')
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ORDER),
          order.findRecursivelyByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ORDER),
          order.deleteRecursivelyByPath,
      );

  return router;
};

