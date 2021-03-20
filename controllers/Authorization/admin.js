const Invitations = require('../../models/invitations');
const {v1: uuidv1} = require('uuid');
const nodemailer = require('nodemailer');


// Show Invitation Page
exports.get_invitation = (req, res) => {
  // res.render('forgot');
  return res.json({response: true, message: 'Invitation Page', Content: null});
};

exports.post_invitation = (req, res) => {
  const invitationId = uuidv1();

  const addInvitation = new Invitations({
    invitation_token: invitationId,
    email: req.body.email,
    invitationExpires: Date.now() + 3600000,
  });

  addInvitation.save((err, success) => {
    if (err) {
      console.log(err);
      return;
    }
  });

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
    service: process.env.EMAIL_PROVIDER,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });


  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.json({
        response: false,
        message: 'An error occurred',
        Content: err,
      });
    } else {
      return res.json({
        response: true,
        message: 'An email has been send with an invitation code',
        Content: null,
      });
    }
  });
};


