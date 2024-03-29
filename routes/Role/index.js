// eslint-disable-next-line new-cap
const router = require('express').Router();
const role = require('../../controllers/Role');
const {requireLogin} = require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/utils');
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
      .get(
          requireLogin,
          role.getUsersWithRoles,
      )
      .post(
          requireLogin,
          requireAccess(action.GRANT, resource.ROLE),
          role.grantUserRole);

  router.route('/by_id')
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ROLE),
          role.findByID,
      )
      .put(
          requireLogin,
          requireAccess(action.UPDATE, resource.ROLE),
          role.updateByID,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ROLE),
          role.deleteByID,
      );

  router.route('/by_path')
      .post(
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
      .post(
          requireLogin,
          requireAccess(action.READ, resource.ROLE),
          role.findRecursivelyByPath,
      )
      .delete(
          requireLogin,
          requireAccess(action.DELETE, resource.ROLE),
          role.deleteRecursivelyByPath,
      );

  router.route('/actions')
      .get(
          requireLogin,
          role.getActions,
      );
  router.route('/resources')
      .get(
          requireLogin,
          role.getResources,
      );

  return router;
};

