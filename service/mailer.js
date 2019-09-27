const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    // secure: false,
    service: 'gmail',
    auth: {
        user: 'gjonathan93113@gmail.com',
        pass: 'ajspasswordismine818',
    },
    tls: {
        rejectUnauthorized: false,
    }

})

const mailOptions = {
    from: 'gjonathan93113@gmail.com',
    to: '',
    subject: '',
    text: '',
}

function sendEmail(to, subject, text){
    mailOptions.to = to;
    mailOptions.subject = subject
    mailOptions.text = text;

    transporter.sendMail(mailOptions, function(err, info){
        if(err) {
            console.log('mail error', err)
        }
        else{
            console.log('sent mail', info);
        }
    })
}

module.exports = sendEmail;