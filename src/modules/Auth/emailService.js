// Importación de módulos necesarios
const nodemailer = require('nodemailer');
require('dotenv').config();

// Creación del transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail', // Servicio de correo electrónico a utilizar
    auth: {
        user: process.env.EMAIL_USER, // Correo electrónico del usuario
        pass: process.env.EMAIL_PASS // Contraseña del correo electrónico
    }
});

// Función para enviar correo electrónico de verificación
const sendVerificationEmail = async (email, code) => {
    // Configuración de las opciones del correo electrónico
    const mailOptions = {
        from: `"Verificación" <${process.env.EMAIL_USER}>`, // Remitente del correo electrónico
        to: email, // Destinatario del correo electrónico
        subject: 'Código de verificación', // Asunto del correo electrónico
        html: `<h2>Tu código es: ${code}</h2>` // Contenido HTML del correo electrónico
    };
    // Envío del correo electrónico
    await transporter.sendMail(mailOptions);
};

// Función para enviar correo electrónico de recuperación de contraseña
const sendPasswordResetEmail = async (email, code) => {
    // Configuración de las opciones del correo electrónico
    const mailOptions = {
        from: `"Recuperación" <${process.env.EMAIL_USER}>`, // Remitente del correo electrónico
        to: email, // Destinatario del correo electrónico
        subject: 'Código de recuperación', // Asunto del correo electrónico
        html: `<h2>Código: ${code}</h2>` // Contenido HTML del correo electrónico
    };
    // Envío del correo electrónico
    await transporter.sendMail(mailOptions);
};

// Exportación de las funciones para su uso en otros módulos
module.exports = { sendVerificationEmail, sendPasswordResetEmail }; 