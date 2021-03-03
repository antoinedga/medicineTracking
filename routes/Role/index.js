// eslint-disable-next-line new-cap
const router = require('express').Router();
const role = require('../../controllers/Role');


module.exports = () => {
  router.route('/')
      .get(role.getAll)
      .post(role.createRole);

  router.route('/user')
      .get(role.getUserWithRolls)
      .post(role.grantUserRole);

  return router;
};

