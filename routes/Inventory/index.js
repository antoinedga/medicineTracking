var router = require('express').Router()
var inventory = require('../../controllers/Inventory')


module.exports = () => {
router.get('/test',inventory.test)

router.route('/')
    .get(inventory.getAll)
    .post(inventory.create)

router.route('/by_id')
    .get(inventory.findByID)
    .delete(inventory.deleteByID)

router.route('/by_path')
    .get(inventory.findByPath)
    .delete(inventory.deleteByPath)

router.route('/by_path/recursive')
    .get(inventory.findRecursivelyByPath)
    .delete(inventory.deleteRecursivelyByPath)

    return router
}