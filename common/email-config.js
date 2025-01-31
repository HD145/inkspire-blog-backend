require('dotenv').config()

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail", host: process.env.MAIL_HOST, port: process.env.MAIL_PORT, secure: true,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_CREDENTIALS,
    },
});

async function handleSendMail(to, otp) {
    const info = await transporter.sendMail({
        from: `<${process.env.MAIL_ID}>`,
        to,
        subject: "OTP Verification",
        text: `Hello. Your One Time Password is ${otp}`
    });
}

module.exports = {
    handleSendMail
}