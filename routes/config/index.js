// eslint-disable-next-line new-cap
const router = require('express').Router();
const config = require('../../controllers/config');
const {requireLogin} =require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/utils');
const {action, resource} = require('../../controllers/Role/enum');

module.exports = () => {
  router.get('/test', config.test);

  router.route('/')
      .get(
          config.getAllNames,
      )
      .post(
          requireLogin,
          requireAccess(action.CREATE, resource.CONFIG),
          config.set,
      );
  router.route('/:name')
      .get(
          requireLogin,
          requireAccess(action.READ, resource.CONFIG),
          config.get,
      );
  return router;
};
