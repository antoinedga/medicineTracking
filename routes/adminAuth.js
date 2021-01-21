const router = require('express').Router()

//import admin controller
const { admin_Login, admin_Registration } = require('../controllers/adminAuthController')
const { invite } = require('../controllers/invite')

router.post('/admin_registration', admin_Registration)
router.post('/admin_login', admin_Login)

router.post('/admin_invite', invite)

module.exports = router
