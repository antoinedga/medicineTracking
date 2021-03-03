// eslint-disable-next-line new-cap
const router = require('express').Router();
const item = require('../../controllers/Item');
const {requireLogin} =require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/Role/utils');
const {action, resource} = require('../../controllers/Role/enum');

module.exports = () => {
  router.get('/test', item.test);

  router.route('/')
      .get(item.getAll)
      .post(
          requireLogin,
          requireAccess(action.CREATE, resource.ITEM),
          item.create,
      );

  router.route('/by_id')
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ITEM),
          item.findByID,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ITEM),
          item.deleteByID,
      );

  router.route('/by_path')
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ITEM),
          item.findByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ITEM),
          item.deleteByPath,
      );

  router.route('/by_path/recursive')
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ITEM),
          item.findRecursivelyByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ITEM),
          item.deleteRecursivelyByPath,
      );

  return router;
};

