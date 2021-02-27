var config = require('../../config')
const {Item,Inventory} = require('../../models')
const {Callback} = require('../Callbacks')


/**
 * item:
 * {
 *    path: /<inv1>/<inv2>
 *    product: 
 *    quantity: 
 * }
 */

exports.getAll = (req, res) => {
    if (process.env.NODE_ENV === config.dev) {
      Item.find({}, Callback('get all Items'))
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' })
    }
}

  
exports.create = (req,res) => {
  var newItem = new Item(req.body)

  Inventory
    .findOne({ path: newItem.path })
    .exec((err,inv) => {
      if (err)
        return res
          .status(400)
          .json({
            response: false,
            message: `Error while checking if inventory exists`, 
            Content: err
          })
      else
        newItem
          .save(Callback('create item'))
    })
}

exports.findAllInInventoriesByPath = (req,res) => {
  Item
    .find({path: new RegExp('^'+req.body.path)})
    .exec(Callback('find items by path'))
}

exports.findAllInInventoryByPath = (req,res) => {
  Item
    .findOne({path: new RegExp('^'+req.body.path+'$')})
    .exec(Callback('find items by path'))
}

exports.deleteManyByPath = (req,res) => {
  Item
    .deleteMany({path: new RegExp('^'+req.body.path)})
    .exec(Callback('delete inventories by path'))
}

exports.test = (req,res) => {
    console.log(req)
    return res.status(200).json({ message: 'Success!' })
}