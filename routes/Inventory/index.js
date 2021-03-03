// eslint-disable-next-line new-cap
const router = require('express').Router();
const inventory = require('../../controllers/Inventory');
const {requireLogin} =require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/Role/utils');
const {action, resource} = require('../../controllers/Role/enum');

module.exports = () => {
  router.get('/test', inventory.test);

  router.route('/')
      .get(inventory.getAll)
      .post(
          requireLogin,
          requireAccess(action.CREATE, resource.INVENTORY),
          inventory.create,
      );

  router.route('/by_id')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.INVENTORY),
          inventory.findByID,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.INVENTORY),
          inventory.deleteByID,
      );

  router.route('/by_path')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.INVENTORY),
          inventory.findByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.INVENTORY),
          inventory.deleteByPath,
      );

  router.route('/by_path/recursive')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.INVENTORY),
          inventory.findRecursivelyByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.INVENTORY),
          inventory.deleteRecursivelyByPath,
      );

  return router;
};

