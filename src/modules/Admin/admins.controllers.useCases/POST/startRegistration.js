import adminService from './../../admin.service.js';
import authService from './../../../Auth/auth.service.js';
import emailService from './../../../Auth/email.service.js';

/**
 * @description Inicia el registro de un administrador en donde se le pasan los datos del administrador y se le envia un codigo de verificacion al correo
 */
const execute = async (req, res) => {
    const { firstName, lastName, birthDate, phone, email, password } = req.body;
    try {
        await adminService.deleteUnverifiedAdmins(email, phone);
        const existingVerified = await adminService.findVerifiedAdmin(email, phone);
        if (existingVerified) {
            const conflictField = existingVerified.email === email ? 'correo' : 'teléfono';
            return res.status(400).json({ message: `El ${conflictField} ya está registrado y verificado` });
        }
        const verificationCode = authService.generateAdminCode();
        const hashedPassword = await authService.hasher(password);
        const newAdmin = await adminService.createAdmin({
            firstName,
            lastName,
            birthDate,
            phone,
            email,
            password: hashedPassword,
            verificationCode,
            codeExpires: Date.now() + 3600000,
        });
        await emailService.sendVerificationEmail(email, verificationCode);
        res.status(200).json({ tempId: newAdmin._id });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el administrador' + error.message });
    }
};

export default execute;