const router = require('express').Router()

//import admin controller
const { get_admin_registration, post_admin_registration, get_admin_login, post_admin_Login, get_invitation, post_invitation  } = require('../controllers/adminAuthController')
// const { invite } = require('../controllers/invite')

// Get and Post for Admin Registration
router.post('/admin_registration', get_admin_registration)
router.post('/admin_registration', post_admin_registration)

// Get and Post for Admin Login
router.get('/admin_login', get_admin_login)
router.post('/admin_login', post_admin_Login)

// Get and Post for New User Invitations
router.get('/admin_invite', get_invitation)
router.post('/admin_invite', post_invitation)

module.exports = router
