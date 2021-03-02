// eslint-disable-next-line new-cap
const router = require('express').Router();
const controller = require('../../controllers/Authorization/admin');

module.exports = () => {
  router.route('/admin_invite')
      .post(controller.post_invitation);
};

