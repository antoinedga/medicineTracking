const User = require('../models/user')
const bcrypt = require("bcrypt")


// Register user and encryption of password
exports.signup = (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({email}).exec((err, user) => {
        if(user) {
            return res.status(400).json({error: 'User with this email already exists.'})
        }
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, function(err, hash) {
            let register_user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            console.log(register_user)
            register_user.save((err, success) => {
                if(err){
                    console.log('Error in signup: ', err)
                    return res.status(400), json({error: err})
                }
                res.json({
                    message: 'Registration Successful!'
                })
            })
        })
    });
}

// Login User
exports.login = (req, res) => {
    var email = req.body.email
    User.findOne({ email }).exec((err, user) => {
        if(err){
            console.log('Login err: ', err)
            return res.status(400), json({error: err})
        }
        if(user == null){
            res.status(400).json({error: 'User does not exist.'})
        }else{
            bcrypt.compare(req.body.password, user.password).then(function(result) {
                if(user.email == req.body.email && result){
                    res.json({message: 'Login Successful!'})
                    console.log('Password Matched.')
                }else{
                    res.json({message: 'Email or Password incorrect.'})
                    console.log('Password does not match')
                }
            });
        }
    });
}
