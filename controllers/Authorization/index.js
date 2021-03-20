const User = require('../../models/user');
const Invitations = require('../../models/invitations');
const {createRefreshToken, verifyRefreshToken} = require('../utils');
const bcrypt = require('bcrypt');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const saltRounds = 10;

// Show Register Form
exports.get_registration = (req, res) => {
  // res.render("register");
  return res.json({
    response: true,
    message: 'Register Page',
    Content: null,
  });
};

// Register user and encryption of password
exports.post_registration = (req, res) => {
  const {email, password, token} = req.body;
  Invitations.findOne({
    invitation_token: token,
    email: email,
    invitationExpires: {$gt: Date.now()},
  }, function(err, user) {
    if (!user) {
      return res.json({
        response: false,
        message: 'Invitation token is invalid or has expired',
        Content: null,
      });
      // res.redirect('back');
    }
    User.findOne({email}).exec((err) => {
      if (err) {
        console.log('User already exists', err);
        return res.json({
          response: false,
          message: 'User already exists',
          Content: null,
        });
      } else {
        bcrypt.hash(password, saltRounds, function(err, hash) {
          const registerUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
          });
          // console.log(register_user)
          registerUser.save((err) => {
            if (err) {
              return res.json({
                response: false,
                message: 'User already exists',
                Content: null,
              });
            }
            Invitations.deleteOne({
              invitation_token: token,
              email: email,
            }, function(err, doc) {});
            return res.json({
              response: true,
              message: 'Registration Successful',
              Content: null,
            });
          });
        });
      }
    });
  });
};

// Show Login Form
exports.get_login = (req, res) => {
  // res.render("register");
  res.json({
    response: true,
    message: 'Login Page.',
    Content: null,
  });
};


// Login User
exports.post_login = (req, res) => {
  const email = req.body.email;
  User.findOne({email}).exec((err, user) => {
    if (err) {
      return res.status(400), json({
        response: false,
        message: 'Login Error.',
        Content: null,
      });
    } else if (user == null) {
      res.status(400).json({
        response: false,
        message: 'User with this email does not exist',
        Content: null,
      });
    } else {
      user.authPassword(req.body.password, user.password)
          .then((passed) => {
            if (!passed) {
              res.json({
                response: false,
                message: 'Password is incorrect',
                Content: null,
              });
            } else {
              createRefreshToken(user._id).then((token) => {
                res.json({
                  response: true,
                  message: 'Login Successful',
                  Content: token,
                });
              },
              ).catch((err) => console.log(err));
            }
          },
          ).catch((err) => console.log(err));
    };
  });
};

exports.refreshToken = (req, res) => {
  verifyRefreshToken(req.body?.refreshToken)
      .then((token) => {
        if (token == undefined) {
          res
              .status(400)
              .json({
                response: false,
                message: 'Invalid refresh token',
                Content: null,
              });
        };
        res
            .status(400)
            .json({
              response: true,
              message: 'Successfully refreshed token',
              Content: token,
            });
      });
};

// exports.post_login = (req, res) => {
//   const email = req.body.email;
//   console.log(req.body);
//   User.findOne({email}).exec((err, user) => {
//     if (err) {
//       return res.status(400), json({
//         response: false,
//         message: 'Login Error.',
//         Content: null,
//       });
//     }
//     if (user == null) {
//       res.status(400).json({
//         response: false,
//         message: 'User with this email does not exist',
//         Content: null,
//       });
//     } else {
//       bcrypt.compare(req.body.password, user.password)
//           .then(function(result) {
//             console.log(user.email == req.body.email && result);
//             if (user.email == req.body.email && result) {
//               console.log(SECRET_KEY);
//               res.json({
//                 response: true,
//                 message: 'Login Successful',
//                 Content: jwt.sign({user: user}, SECRET_KEY),
//               });
//             } else {
//               res.json({
//                 response: false,
//                 message: 'Password is incorrect',
//                 Content: null,
//               });
//             }
//           }).catch((err) => {
//             res.json({
//               response: false, message: 'Password is incorrect',
//               Content: null,
//             });
//           });
//     }
//   });
// };

// Show Forget Password page
exports.get_forget = (req, res) => {
  // res.render('forgot');
  return res.json({
    response: true,
    message: 'Forget Password Page',
    Content: null,
  });
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
      User.findOne({email: req.body.email}, function(err, user) {
        if (!user) {
          console.log('Error: No account with that email address exists.');
          // req.flash('error', 'No account with that email address exists.');
          return res.json({
            response: false, message: 'User does not exists',
            Content: null,
          });
          // res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token) {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_PROVIDER,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        to: req.body.email,
        from: process.env.EMAIL_ADDRESS,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) ' +
          'have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your ' +
          'browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you are registering on you phone, copy the link below and ' +
          'paste it on the registration page.\n' + token + ' ' +
          'If you did not request this, please ignore this email and your ' +
          'password will remain unchanged.\n',
      };
      transporter.sendMail(mailOptions, function() {
        console.log('mail sent');
        return res.json({
          response: true, message: 'Mail sent',
          Content: null,
        });
        // done(err, 'done');
      });
    },
  ], function(err) {
    if (err) return next(err);
    // res.redirect('/forgot');
    return res.json({
      response: false,
      message: 'An error occurred',
      Content: null,
    });
  });
};

// Show Reset Page after user clicks in his email
exports.get_reset = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()},
  }, function(err, user) {
    if (!user) {
      console.log('Error: Password reset token is invalid or has expired.');
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.json({
        response: false,
        message: 'Password reset token is invalid or has expired',
        Content: null,
      });
      // res.redirect('/forgot');
    }
    return res.json({
      response: true,
      message: 'Password Reset Page',
      Content: null,
    });
    // res.render('api_user/reset/', {token: req.params.token});
  });
};

// Reset Page
exports.post_reset = (req, res) => {
  async.waterfall([
    function() {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()},
      }, function(err, user) {
        if (!user) {
          res.json('Error: Password reset token is invalid or has expired.');
          return res.json({
            response: false,
            message: 'Password reset token is invalid or has expired',
            Content: null,
          });
          // res.redirect('back');
        }
        if (req.body.new_password === req.body.confirm_password) {
          bcrypt.hash(req.body.new_password, saltRounds, function(err, hash) {
            if (err) {
              return console.log(err);
            }
            // Store hash in your password DB.
            req.body.new_password = hash;
            user.updateOne({
              password: req.body.new_password,
              resetPasswordExpires: undefined,
              resetPasswordToken: undefined,
            }, function(err) {
              if (err) {
                console.log('Err: ', err);
                return res.json({
                  response: false,
                  message: 'An error occurred',
                  Content: null,
                });
              } else {
                console.log('Password Updated!');
                return res.json({
                  response: true,
                  message: 'Password updated',
                  Content: null,
                });
              }
            });
          });
        } else {
          console.log('Error: Passwords do not match');
          // req.flash("error", "Passwords do not match.");
          return res.json({
            response: false,
            message: 'Passwords do not match',
            Content: null,
          });
          // res.redirect('back');
        }
      });
    },
  ], function() {
    return res.json({
      response: true,
      message: 'An error occurred',
      Content: null,
    });
  });
};
