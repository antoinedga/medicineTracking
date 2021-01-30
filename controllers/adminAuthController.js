const Admin = require('../models/admin')
const invitations = require('../models/invitations')
const User = require('../models/user')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const async = require("async");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid');
const nodemailer = require('nodemailer')
const SECRET_KEY = process.env.JWT_SECRETKEY

// Show Admin Registration Page
exports.get_admin_registration = (req, res) => {
    //res.render("register"); 
    res.json('Admin Registration Page')
};

// Register Admin and encryption of password
exports.post_admin_registration = (req, res) => {
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

// Show Login Page
exports.get_admin_login = (req, res) => {
    //res.render("register"); 
    res.json('Admin Login Page')
};

// Post Login Page
exports.post_admin_Login = (req, res) => {
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

// Show Invitation Page
exports.get_invitation = (req, res) => {
    //res.render('forgot');
    res.json('Invitation Page')
};

// Post Invitation Page
exports.post_invitation = (req, res) => {
  const invitation_id = uuidv1();

  let add_invitation = new invitations({
      invitation_token: invitation_id,
      resetPasswordExpires: Date.now() + 3600000
  })

  add_invitation.save((err, success) => {
      if(err){
          console.log(err)
          return
      }
      res.json({
          message: 'Invitation Saved in db!'
      }) 
  })

  response = {
      email: req.body.email,
  }

  const mailOptions = {
      from: 'medicine.tracking@outlook.com',
      to: req.body.email,
      subject: 'Invitation for Registration',
      text: 'This is an invitation to register yourself.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/api_user/signup/' + invitation_id + '\n\n'
  };

  const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
          user: 'medicine.tracking@outlook.com',
          pass: 'Medicine123$%^'
      }
  });

  transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
          return console.log(err)
      } else {
          console.log('Invitation has been sent to email Successfully!')
          res.json({
              message: 'Invitation has been sent to email Successfully!'
          })
      }
  })
};


