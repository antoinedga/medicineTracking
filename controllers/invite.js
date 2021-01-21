
const nodemailer = require('nodemailer')
const invitations = require('../models/invitations')
const { v1: uuidv1 } = require('uuid');

exports.invite = (req, res) => {
    const invitation_id = uuidv1();

    let add_invitation = new invitations({
        invitation_code: invitation_id
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
        text: 'Use the below link to register',
        html: invitation_id
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
            console.log(JSON.stringify(res))
            res.json({
                message: 'Invitation has been sent to email Successfully!'
            })
        }
    })
};
