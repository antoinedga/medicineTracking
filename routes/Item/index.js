var router = require('express').Router()
var item = require('../../controllers/Item')


module.exports = () => {
router.get('/test',item.test)

router.route('/')
    .get(item.getAll)
    .post(item.create)

router.route('/by_id')
    .get(item.findByID)
    .delete(item.deleteByID)

router.route('/by_path')
    .get(item.findByPath)
    .delete(item.deleteByPath)
    
router.route('/by_path/recursive')
    .get(item.findRecursivelyByPath)
    .delete(item.deleteRecursivelyByPath)

    return router
}