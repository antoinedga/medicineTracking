const Admin = require('../../models/admin');
const Invitations = require('../../models/invitations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v1: uuidv1} = require('uuid');
const nodemailer = require('nodemailer');
const SECRET_KEY = require('../../config').secrets.jwt;

// Show Admin Registration Page
exports.get_admin_registration = (req, res) => {
  // res.render("register");
  return res.json({
    response: true,
    message: 'Admin Registration Page',
    Content: null,
  });
};

// Register Admin and encryption of password
exports.post_admin_registration = (req, res) => {
  const {email, password} = req.body;
  Admin.findOne({email}).exec((err, admin) => {
    if (admin) {
      return res.json({
        response: false,
        message: 'Admin with email already exists',
        Content: null,
      });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
      const registerAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      console.log(registerAdmin);
      registerAdmin.save((err, success) => {
        if (err) {
          console.log('Error in signup: ', err);
          return res.json({
            response: false,
            message: 'An error occurred', Content: null,
          });
        }
        return res.json({
          response: true,
          message: 'Registration Successful',
          Content: null,
        });
      });
    });
  });
};

// Show Admin Registration Page
exports.get_admin_login = (req, res) => {
  // res.render("register");
  return res.json({response: true, message: 'Admin Login Page', Content: null});
};

// Admin User
exports.post_admin_Login = (req, res) => {
  const email = req.body.email;
  Admin.findOne({email}).exec((err, user) => {
    if (err) {
      console.log('Login err: ', err);
      return res.json({
        response: false,
        message: 'An error occurred',
        Content: null,
      });
    }
    if (user == null) {
      res.status(400).json({error: 'Admin user does not exist.'});
    } else {
      bcrypt.compare(req.body.password, user.password)
          .then(function(result) {
            if (user.email == req.body.email && result) {
              const token = jwt.sign({_id: user._id}, SECRET_KEY);
              return res.json({
                response: true,
                message: 'Admin Login Successful',
                Content: token,
              });
            } else {
              return res.json({
                response: false,
                message: 'Invalid password.',
                Content: null,
              });
            }
          }).catch((err) => {
            return res.json({
              response: false,
              message: 'Invalid password.',
              Content: null,
            });
          });
    }
  });
};

// Show Invitation Page
exports.get_invitation = (req, res) => {
  // res.render('forgot');
  return res.json({response: true, message: 'Invitation Page', Content: null});
};

exports.post_invitation = (req, res) => {
  const invitationId = uuidv1();

  const addInvitation = new Invitations({
    invitation_token: invitationId,
    invitationExpires: Date.now() + 3600000,
  });

  addInvitation.save((err, success) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  response = {
    email: req.body.email,
  };

  const mailOptions = {
    from: 'medicine.tracking@outlook.com',
    to: req.body.email,
    subject: 'Invitation for Registration',
    text: 'This is an invitation to register yourself.\n\n' +
      'Please click on the following link, ' +
      'or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/api/user/signup/' + invitationId + '\n\n' +
      'If you are registering on you phone, ' +
      'copy the link below and paste it on the registration page.\n' +
      invitationId,
  };

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'medicine.tracking@outlook.com',
      pass: 'Medicine123$%^',
    },
  });

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      return res.json({
        response: false,
        message: 'An error occurred',
        Content: null,
      });
    } else {
      console.log('Invitation has been sent to email Successfully!');
      return res.json({
        response: true,
        message: 'An email has been send with an invitation code',
        Content: null,
      });
    }
  });
};


