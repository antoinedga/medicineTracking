const User = require('../models/user')
const Invitations = require('../models/invitations')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRETKEY
const async = require("async");
const crypto = require("crypto");
const nodemailer = require('nodemailer')
const saltRounds = 10

// Show Register Form
exports.get_registration = (req, res) => {
    //res.render("register"); 
    return res.json({response: true, message: 'Register Page', Content: null})
 };

 // create test user 
 function test() {
    bcrypt.hash('123qwe', saltRounds, function(err, hash) {
      let register_user = new User({
          name: 'test',
          email: 'test',
          password: hash
      });
      register_user.save()
  });
 }

// Register user and encryption of password
exports.post_registration = (req, res) => {
  const { email, password} = req.body;
  Invitations.findOne({ invitation_token: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if(!user){
      console.log('Error: Password reset token is invalid or has expired.')
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.json({response: false, message: 'Password reset token is invalid or has expired', Content: null})
      // res.redirect('back');
    }
    User.findOne({ email }).exec((err, user) => {
      if(err){
        console.log('User already exists', err)
        return res.json({response: false, message: 'User already exists', Content: null})
      }
      else{
        bcrypt.hash(password, saltRounds, function(err, hash) {
            let register_user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            //console.log(register_user)
            register_user.save((err, success) => {
                if(err){
                  return res.json({response: false, message: 'User already exists', Content: null})
                }
                Invitations.updateOne({ invitation_token : undefined, resetPasswordExpires : undefined }, function (err, result) {
                  if(err){
                    return res.status(400), json({error: err})
                  }       
                }); 
                return res.json({response: true, message: 'Registration Successful', Content: null})
            })
        });
      }
    });
  });
}

// Show Login Form
exports.get_login = (req, res) => {
    //res.render("register"); 
    res.json({response: true, message: 'Login Page.', Content: null})
 };

// Login User
exports.post_login = (req, res) => {
    var email = req.body.email
    User.findOne({ email }).exec((err, user) => {
        if(err){
            return res.status(400), json({response: false, message: 'Login Error.', Content: null})
        }
        if(user == null){
            res.status(400).json({response: false, message: 'User with this email does not exist', Content: null})
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(function(result) {
                if(user.email == req.body.email && result){
                    const token = jwt.sign({ user: user }, SECRET_KEY)
                    res.json({response: true, message: 'Login Successful', Content: token})
                }else{
                    res.json({response: false, message: 'Password is incorrect', Content: null})
                }
            }).catch(err => {
                res.json({response: false, message: 'Password is incorrect', Content: null})
            });
        }
    });
}

// Show Forget Password page
exports.get_forget = (req, res) => {
  //res.render('forgot');
  return res.json({response: true, message: 'Forget Password Page', Content: null})
};

// Forget Password page
exports.post_forget = (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
            console.log('Error: No account with that email address exists.')
          //req.flash('error', 'No account with that email address exists.');
          return res.json({response: false, message: 'User does not exists', Content: null})
          // res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
        const transporter = nodemailer.createTransport({
        service: 'hotmail', 
        auth: { 
          user: 'medicine.tracking@outlook.com',
          pass: 'Medicine123$%^'
        }
      });
      const mailOptions = {
        to: req.body.email,
        from: 'medicine.tracking@outlook.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you are registring on you phone, copy the link below and paste it on the registration page.\n' + token  +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        return res.json({response: true, message: 'Mail sent', Content: null})
        // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        // done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    // res.redirect('/forgot');
    return res.json({response: false, message: 'An error occured', Content: null})
  });
};

// Show Reset Page after user clicks in his email
exports.get_reset = (req, res) =>{
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
        console.log('Error: Password reset token is invalid or has expired.')
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.json({response: false, message: 'Password reset token is invalid or has expired', Content: null})
      // res.redirect('/forgot');
    }
    return res.json({response: true, message: 'Password Reset Page', Content: null})
    // res.render('api_user/reset/', {token: req.params.token});
  });
};

// Reset Page
exports.post_reset = (req, res) => {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            res.json('Error: Password reset token is invalid or has expired.')
            // req.flash('error', 'Password reset token is invalid or has expired.');
            return res.json({response: false, message: 'Password reset token is invalid or has expired', Content: null})
          // res.redirect('back');
        }
        if(req.body.new_password === req.body.confirm_password) {
          bcrypt.hash( req.body.new_password, saltRounds, function(err, hash) {
            if(err){
              return console.log(err)
            }
            // Store hash in your password DB.
            req.body.new_password = hash
            user.updateOne({ password : req.body.new_password, resetPasswordExpires : undefined, resetPasswordToken : undefined }, function (err, result) {
              if(err){
                      console.log('Err: ', err)
                      return res.json({response: false, message: 'An error occured', Content: null})
              }else{
                console.log('Password Updated!');
                return res.json({response: true, message: 'Password updated', Content: null})
              }         
            }); 
          });
        }else {
          console.log('Error: Passwords do not match')
          // req.flash("error", "Passwords do not match.");
          return res.json({response: false, message: 'Passwords do not match', Content: null})
          // res.redirect('back');
        }
      });
    },
  ], function(err) {
    return res.json({response: true, message: 'An error occured', Content: null})
  });
};
