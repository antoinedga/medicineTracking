// eslint-disable-next-line new-cap
const router = require('express').Router();
const controller = require('../../controllers');

module.exports = () => {
  router.route('/signup/:token')
      .post(controller.authorization.post_registration);

  router.route('/login')
      .post(controller.authorization.post_login);

  router.route('/forget')
      .post(controller.authorization.post_forget);

  router.route('/reset/:token')
      .post(controller.authorization.post_reset);
};

