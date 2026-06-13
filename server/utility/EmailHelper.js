const nodemailer = require('nodemailer');

const EmailSend = async (EmailTo, EmailText, EmailSubject) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'khanshovo67@gmail.com',
            pass: 'dmjhqizwuwvlbvsy'
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 5000,  
        greetingTimeout: 5000,    
        socketTimeout: 5000      
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