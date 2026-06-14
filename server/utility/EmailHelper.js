const nodemailer = require('nodemailer');

const EmailSend = async (EmailTo, EmailText, EmailSubject) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
            user: 'resend',
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: 'CoreVault <onboarding@resend.dev>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = EmailSend;