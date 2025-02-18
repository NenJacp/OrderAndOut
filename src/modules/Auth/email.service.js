require('dotenv').config(); // Importación de dotenv

const nodemailer = require('nodemailer'); // Importación de nodemailer


/**
 * @description Creación del transporte de correo electrónico
 * @const {object} transporter
 * @const {string} service
 * @const {object} auth
 * @const {string} user
 * @const {string} pass
 */
const transporter = nodemailer.createTransport({
    service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

/**
 * @description Función para enviar correo electrónico de verificación
 * @param {string} email
 * @param {string} code
 */
const sendVerificationEmail = async (email, code) => {
    
    /**
     * @description Configuración de las opciones del correo electrónico
     * @const {object} mailOptions
     * @const {string} from
     * @const {string} to
     * @const {string} subject
     * @const {string} html
     */
    const mailOptions = {
        from: `"Verificación" <${process.env.EMAIL_USER}>`, // Remitente del correo electrónico
        to: email, // Destinatario del correo electrónico
        subject: 'Código de verificación', // Asunto del correo electrónico
        html: `<h2>Tu código es: ${code}</h2>` // Contenido HTML del correo electrónico
    };

    /**
     * @description Envío del correo electrónico
     * @const {Promise<void>} result
     */
    const result = await transporter.sendMail(mailOptions);

    /**
     * @description Devolución del resultado del envío del correo electrónico
     * @returns {Promise<void>} result
     */
    return result;
};

/**
 * @description Función para enviar correo electrónico de recuperación de contraseña
 * @param {string} email
 * @param {string} code
 * @const {object} sendPasswordResetEmail
 */
const sendPasswordResetEmail = async (email, code) => {
    
    /**
     * @description Configuración de las opciones del correo electrónico
     * @const {object} mailOptions
     * @const {string} from
     * @const {string} to
     * @const {string} subject
     * @const {string} html
     * @const {object} mailOptions
     */
    const mailOptions = {
        from: `"Recuperación" <${process.env.EMAIL_USER}>`, // Remitente del correo electrónico
        to: email, // Destinatario del correo electrónico
        subject: 'Código de recuperación', // Asunto del correo electrónico
        html: `<h2>Código: ${code}</h2>` // Contenido HTML del correo electrónico
    };

    /**
     * @description Envío del correo electrónico
     * @const {Promise<void>} result
     */
    const result = await transporter.sendMail(mailOptions);

    /**
     * @description Devolución del resultado del envío del correo electrónico
     * @returns {Promise<void>} result
     */ 
    return result;
};

/**
 * @description Exportación de las funciones para su uso en otros módulos
 * @returns {object} sendVerificationEmail, sendPasswordResetEmail
 */ 
module.exports = { 
    sendVerificationEmail, 
    sendPasswordResetEmail 
}; 