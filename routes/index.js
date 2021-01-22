var router = require('express').Router()
var userRoute = require('./userAuth')
var adminRoute = require('./adminAuth')


module.exports = () => {
  router.use('/user', userRoute())
  router.use('/admin', adminRoute())

  return router
}