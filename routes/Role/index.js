// eslint-disable-next-line new-cap
const router = require('express').Router();
const role = require('../../controllers/Role');
const {requireLogin} =require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/Role/utils');
const {action, resource} = require('../../controllers/Role/enum');

module.exports = () => {
  router.get('/test', role.test);

  router.route('/')
      .get(role.getAll)
      .post(
          requireLogin,
          requireAccess(action.CREATE, resource.ROLE),
          role.create,
      );

  router.route('/user')
      .post(
          requireLogin,
          requireAccess(action.GRANT, resource.ROLE),
          role.grantUserRole);

  router.route('/by_id')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.ROLE),
          role.findByID,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ROLE),
          role.deleteByID,
      );

  router.route('/by_path')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.ROLE),
          role.findByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ROLE),
          role.deleteByPath,
      );

  router.route('/by_path/recursive')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.ROLE),
          role.findRecursivelyByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ROLE),
          role.deleteRecursivelyByPath,
      );

  return router;
};

