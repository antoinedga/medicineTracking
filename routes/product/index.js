// eslint-disable-next-line new-cap
const router = require('express').Router();
const {requireLogin} =require('../../middleware/requireLogin');
const {requireAccess} = require('../../controllers/utils');
const {action, resource} = require('../../controllers/Role/enum');
const eaches = require('../../controllers/Eaches');

module.exports = () => {
  router.route('/define')
      .post(
          requireLogin,
          requireAccess(action.CREATE, resource.EACHES),
          eaches.saveConfirmedProductData,
      );
  router.route('/define/multiple')
      .post(
          requireLogin,
          requireAccess(action.CREATE, resource.EACHES),
          eaches.saveAllConfirmedProductData,
      );

  router.route('/search')
      .post(
          eaches.search,
      );

  return router;
};
