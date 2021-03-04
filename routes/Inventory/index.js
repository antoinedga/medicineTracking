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

  router.route('/paths')
      .post(
          requireLogin,
          inventory.getPaths,
      );
  router.route('/complete_paths')
      .post(
          requireLogin,
          inventory.getCompletePaths,
      );

  router.route('/by_id')
      .post(
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
      .post(
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
      .post(
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

