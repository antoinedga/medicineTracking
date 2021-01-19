const Admin = require('../models/admin')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRETKEY

// Register Admin and encryption of password
exports.admin_Registration = (req, res) => {
    const {email, password} = req.body;
    Admin.findOne({email}).exec((err, admin) => {
        if(admin) {
            return res.status(400).json({error: 'Admin user with this email already exists.'})
        }
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, function(err, hash) {
            let register_admin = new Admin({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            console.log(register_admin)
            register_admin.save((err, success) => {
                if(err){
                    console.log('Error in signup: ', err)
                    return res.status(400), json({error: err})
                }
                res.json({
                    message: 'Admin Registration Successful!'
                })
            })
        })
    });
}

// Admin User
exports.admin_Login = (req, res) => {
    var email = req.body.email
    Admin.findOne({ email }).exec((err, user) => {
        if(err){
            console.log('Login err: ', err)
            return res.status(400), json({error: err})
        }
        if(user == null){
            res.status(400).json({error: 'Admin user does not exist.'})
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(function(result) {
                if(user.email == req.body.email && result){
                    const token = jwt.sign({_id: user._id}, SECRET_KEY)
                    res.json({message: 'Admin Login Successful!!', token})
                }else{
                    res.json({message: 'Invalid Email or Password.'})
                }
            }).catch(err => {
                console.log(err)
            });
        }
    });
}
