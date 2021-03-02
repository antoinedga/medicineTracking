var router = require('express').Router()
var controller = require('../../controllers')

module.exports = () => {
router.route('/place_order')
    .post(controller.features.post_placeOrder)

router.route('/view_order')
    .post(controller.features.get_viewStoredOrder)
    
router.route('/update_order/:orderNumber')
    .post(controller.features.put_updateOrder)

}