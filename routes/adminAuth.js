const router = require('express').Router()

//import admin controller
const { admin_Login, admin_Registration } = require('../controllers/adminAuthController')

router.post('/admin_registration', admin_Registration)
router.post('/admin_login', admin_Login)

module.exports = router
