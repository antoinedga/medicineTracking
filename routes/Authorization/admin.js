var router = require('express').Router()
var controller = require('../../controllers/Authorization/admin')

module.exports = () => {
router.route('/admin_invite')
    .post(controller.post_invitation)
}