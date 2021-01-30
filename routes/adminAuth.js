const express = require('express')
const router = require('express').Router()
const verifyToken = require('../middlewareVerification/tokenVerification')

//import controller
const { get_registration, post_registration, get_login, post_login, get_forget, post_forget, get_reset, post_reset } = require('../controllers/userAuthController')

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
// router.get('/placeOrder', verifyToken, placeOrder)

module.exports = router
