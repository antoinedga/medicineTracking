// eslint-disable-next-line new-cap
const router = require('express').Router();
const order = require('../../controllers/order');
const {requireLogin} =require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/Role/utils');
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

  router.route('/by_id')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.ORDER),
          order.findByID,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ORDER),
          order.deleteByID,
      );

  router.route('/by_path')
      .get(
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
      .get(
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

