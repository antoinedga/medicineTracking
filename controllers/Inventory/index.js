var config = require('../../config')
var Inventory = require('../../models/Inventory')


exports.getAll = (req, res) => {
    console.log("inventory/getall")
    if (process.env.NODE_ENV === config.dev) {
      Inventory.find({}, (err, inventories) => {
        if (err) {
          res.send(err)
        } else {
          res.json(inventories)
        }
      })
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' })
    }
  }

exports.createInventory = (req,res) => {
    newInventory = new Inventory(req.body)

    if (newInventory.parent_inventory_id == null) {
        newInventory.save((err, inventory) => {
            if (err) {
              return res.status(400).json({ message: 'Inventory could not be created' })
            } else {
              return res.status(200).json({ message: 'Inventory successfully created' })
            }
        })
    } else{
        Inventory
            .findById(newInventory.parent_inventory_id)
            .exec((err,parent) => {
                if (err) throw err
                if (!parent) {
                    return res.status(401).json({ message: 'Parent does not exist!' })
                } else {
                    newInventory.location = parent.location + "/" + parent._id
                    newInventory.save((err, inventory) => {
                        if (err) {
                          return res.status(400).json({ message: 'Inventory could not be created' })
                        } else {
                            Inventory
                                .updateOne(
                                    { _id: parent._id },
                                    { $push: { child_inventories: inventory._id } }
                                )
                                .exec((err,_) => {
                                    if (err) throw err
                                    else {
                                        return res.status(200).json({ message: 'Inventory successfully created' })
                                    }
                                })
                        }
                    })
                }
            })
    }
}

exports.test = (req,res) => {
    console.log(req)
    return res.status(200).json({ message: 'Success!' })
}