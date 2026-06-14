const nodemailer = require('nodemailer');

const EmailSend = async (EmailTo, EmailText, EmailSubject) => {
    let transporter = nodemailer.createTransport({
     host: 'mail.teamrabbil.com',
port: 587,
secure: false,
auth: {
    user: 'info@teamrabbil.com',
    pass: '~sR4[bhaC[Qs'
},
tls: { rejectUnauthorized: false }
    });

    let mailOptions = {
        from: `CoreVault <info@teamrabbil.com>`,
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = EmailSend;