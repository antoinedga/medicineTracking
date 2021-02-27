const router = require('express').Router()
const verifyToken = require('../middlewareVerification/tokenVerification')

//import controller
const { get_registration, post_registration, get_login, post_login, get_forget, post_forget, get_reset, post_reset } = require('../controllers/userAuthController')
const { get_placeOrder, post_placeOrder, get_viewStoredOrder, post_viewStoredOrder, get_updateOrder, put_updateOrder } = require('../controllers/userFeatController')

// Get and Post Routes to Registration Page
router.get('/signup/:token', get_registration)
router.post('/signup/:token', post_registration)

// Get and Post Routes to Login Page
router.get('/login', get_login)
router.post('/login', post_login)

// Get and Post Routes to Forget password Page
router.get('/forget', get_forget)
router.post('/forget', post_forget)

// Get and Post Routes to Password Reset Page
router.get('/reset/:token', get_reset)
router.post('/reset/:token', post_reset)

// Get and Post Routes to Placing an Order
router.get('/placeOrder', verifyToken, get_placeOrder)
router.post('/placeOrder', verifyToken, post_placeOrder)

// Get and Post view-order by its Order Number.
router.get('/view_order', verifyToken, get_viewStoredOrder)
router.post('/view_order', verifyToken, post_viewStoredOrder)

// Get and Put Updates the by its Order Number.
router.get('/update_order/:orderNumber', verifyToken, get_updateOrder)
router.put('/update_order/:orderNumber', verifyToken, put_updateOrder)

module.exports = router