var config = require('../../config')
const {Inventory} = require('../../models')
const {Callback} = require('../Callbacks')


/**
 * inventory:
 * {
 *    name: <inv2>,
 *    path: ,<inv1>,<inv2>,
 * }
 */

exports.getAll = (req, res) => {
    if (process.env.NODE_ENV === config.dev) {
      Inventory.find({}, Callback('get all inventories'))
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' })
    }
  }

  // res.status(401).json({response: false, message: `Unauthorized`, Content: null})
  //mongoose.connect('mongodb+srv://Dev:4yTmWteU5nbNfHXQ@cluster0.0yiol.mongodb.net/Dev?retryWrites=true&w=majority', {useNewUrlParser: true,useFindAndModify: true,useUnifiedTopology: true,useCreateIndex: true}).then(() => console.log('Database Connected')).catch(err => console.log('Database Connection Error: ', err))
// function test(req) {
//   var newInventory = new Inventory(req)

//   Inventory
//   .findOne({ path: newInventory.path })
//   .exec((err,inv) => {
//     if (inv)
//       return console.log(`Inventory with path ${newInventory.path} already exists`)

//     newInventory
//       .save((err,inv) => {
//         console.log(JSON.stringify(inv, null,4))
//         console.log(JSON.stringify(err, null,4))
//       })
//   })
// }
// function testFind(req) {
//   var newInventory = new Inventory(req)

//   Inventory
//   .find({ path: new RegExp('^'+newInventory.path) })
//   .exec((err,inv) => {
//     console.log(JSON.stringify(inv, null,4))
//   })
// }

exports.create = (req,res) => {
  var newInventory = new Inventory(req.body)

  Inventory
    .findOne({ path: newInventory.path })
    .exec((err,inv) => {
      if (err)
        return res
          .status(400)
          .json({
            response: false,
            message: `Error while checking uniqueness of inventory path`, 
            Content: err
          })
      else if (inv)
        return res
          .status(400)
          .json({
            response: false,
            message: `Inventory with path ${newInventory.path} already exists`, 
            Content: null
          })
      else
        newInventory
          .save(Callback('create inventory'))
    })
}

exports.findRecursivelyByPath = (req,res) => {
  Inventory
    .find({path: new RegExp('^'+req.body.path)})
    .exec(Callback('find inventories by path'))
}

exports.findByPath = (req,res) => {
  Inventory
    .findOne({path: new RegExp('^'+req.body.path+'$')})
    .exec(Callback('find inventory by path'))
}

exports.findByID = (req,res) => {
  Inventory
    .findById(req.body._id)
    .exec(Callback('find inventory by _id'))
}

exports.deleteRecursivelyByPath = (req,res) => {
  Inventory
    .deleteMany({path: new RegExp('^'+req.body.path)})
    .exec(Callback('delete inventories by path'))
}

exports.deleteByPath = (req,res) => {
  Inventory
    .deleteMany({path: new RegExp('^'+req.body.path+'$')})
    .exec(Callback('delete inventory by path'))
}

exports.deleteByID = (req,res) => {
  Inventory
    .deleteByID(req.body._id)
    .exec(Callback('delete inventory by _id'))
}

exports.test = (req,res) => {
    console.log(req)
    return res.status(200).json({ message: 'Success!' })
}