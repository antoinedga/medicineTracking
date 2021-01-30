var router = require('express').Router()
var userRoute = require('./userAuth')
var adminRoute = require('./adminAuth')
var inventoryRoute = require('./Inventory')


module.exports = () => {
    router.use('/inventory', inventoryRoute())
    router.use('/user', userRoute)
    router.use('/admin', adminRoute)

    router.get('*', (req, res) => {
        
      })

  return router
}