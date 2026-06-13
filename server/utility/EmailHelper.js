const nodemailer = require('nodemailer');

const EmailSend = async (EmailTo, EmailText, EmailSubject) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'khanshovo67@gmail.com',
            pass: 'qcvclumbyxeojjog'

        },
        tls: {
            rejectUnauthorized: false  
        }
    });

    let mailOptions = {
        from: `CoreVault <khanshovo67@gmail.com>`,
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = EmailSend;