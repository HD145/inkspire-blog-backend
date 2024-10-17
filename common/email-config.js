const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail", host: "smtp.gmail.com", port: 465, secure: true,
    auth: {
        user: "workwithus200@gmail.com",
        pass: "mxhs jyxt uner xarr",
    },
});

async function handleSendMail(to, otp) {
    const info = await transporter.sendMail({
        from: '<workwithus200@gmail.com>',
        to,
        subject: "OTP Verification",
        text: `Hello. Your One Time Password is ${otp}`
    });
}

module.exports = {
    handleSendMail
}