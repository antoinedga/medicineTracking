var router = require('express').Router()
var controller = require('../../controllers')


module.exports = () => {
router.route('/signup/:token')
    .post(controller)
}