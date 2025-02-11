const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (toEmail, code) => {
    const mailOptions = {
        from: `"Verificación" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Código de verificación',
        html: `<h2>Tu código es: ${code}</h2>`
    };
    await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (toEmail, code) => {
    const mailOptions = {
        from: `"Recuperación" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Código de recuperación',
        html: `<h2>Código: ${code}</h2>`
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail }; 