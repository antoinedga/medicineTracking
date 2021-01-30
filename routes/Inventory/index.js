var router = require('express').Router()
var controller = require('../../controllers')


module.exports = () => {
router.get('/test',controller.inventory.test)
router.route('/')
    .get(controller.inventory.getAll)
    .post(controller.inventory.createInventory)

    return router
}
