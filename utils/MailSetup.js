const nodemailer = require("nodemailer");

async function sendEmail(options) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP,
        port: 587,
        secure: false,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: "Admin <wemakegeeks@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: "Find My pg",
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;
