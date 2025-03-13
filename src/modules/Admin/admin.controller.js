import adminService from './admin.service.js';
import authService from '../Auth/auth.service.js';
import emailService from '../Auth/email.service.js';

/**
 * @description Inicia el registro de un administrador en donde se le pasan los datos del administrador y se le envia un codigo de verificacion al correo
 */
const startRegistration = async (req, res) => {
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
        res.status(200).json({ tempId: newAdmin._id, verificationCode });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el administrador' + error.message });
    }
};

/**
 * @description Verifica y activa la cuenta de un administrador se le pasa el id temporal y el codigo de verificacion
 */
const verifyAndActivate = async (req, res) => {
    const { tempId, code } = req.body;
    try {
        const admin = await adminService.findAdminWithCode(tempId, code);
        if (!admin) {
            try {
                return res.status(400).json({ message: 'Código inválido o expirado (1 hora de validez)' + error.message });
            } catch (error) {
                return res.status(400).json({ message: 'Código inválido o expirado (1 hora de validez)' + error.message });
            }
        }
        await adminService.updateAdminVerification(admin._id, {
            isVerified: true,
            verificationCode: null,
            codeExpires: null
        });
        res.status(201).json({ message: 'Cuenta activada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: `Error al activar la cuenta: ${error.message}` });
    }
};

/**
 * @description Inicia sesion de un administrador se le pasan el correo y la contraseña
 */
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await adminService.getAdminByEmail(email);
        if (!admin) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        if (!admin.isVerified) {
            return res.status(403).json({ message: 'Cuenta no verificada' });
        }
        const isPasswordValid = await authService.comparer(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const currentAdmin = await adminService.getAdminById(admin._id);

        const token = authService.generateAdminAuthToken({
            id: admin._id.toString(),
            type: 'admin',
            restaurant: currentAdmin.restaurant?.toString(),
            name: `${currentAdmin.firstName} ${currentAdmin.lastName}` // Añadido el nombre del administrador al JWT
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

/**
 * @description Solicita un codigo de recuperacion de contraseña se le pasa el correo
 */
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const admin = await adminService.getAdminByEmail(email);
        if (!admin) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const resetCode = authService.generateAdminCode();
        await adminService.updateAdminById(admin._id, {
            resetPasswordCode: resetCode,
            resetPasswordExpires: Date.now() + 600000
        });
        await emailService.sendPasswordResetEmail(email, resetCode);
        res.status(200).json({ message: 'Código de recuperación enviado', resetCode });
    } catch (error) {
        res.status(500).json({ message: `Error al enviar el código de recuperación: ${error.message}` });
    }
};

/**
 * @description Recupera la contraseña de un administrador se le pasa el correo, el codigo de recuperacion y la nueva contraseña
 */
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const admin = await adminService.findAdminForReset(email, code);
        if (!admin) {
            return res.status(400).json({ message: 'Código inválido o expirado' + error.message });
        }
        const hashedPassword = await authService.hasher(newPassword);
        await adminService.updateAdminById(admin._id, {
            password: hashedPassword,
            resetPasswordCode: null,
            resetPasswordExpires: null
        });
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña' + error.message });
    }
};

/**
 * @description Obtiene un administrador por el JWT
 */
const getCurrentAdmin = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await adminService.getAdminById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' + error.message });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el administrador: ' + error.message });
    }
}

/**
 * @description Actualiza un administrador por el JWT
 */
const updateCurrentAdmin = async (req, res) => {

    if (req.body.password) {
        return res.status(403).json({ message: 'No se puede editar el password desde aquí' });
        //req.body.password = await authService.hasher(req.body.password);
    }

    if (req.body.email) {
        return res.status(403).json({ message: 'No puedes cambiar tu correo tu mismo, contactar a soporte. Tel: XXXXXXXXXX'})
    }

    try {
        const adminId = req.user.id;
        const updatedAdmin = await adminService.updateAdminById(adminId, req.body);
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el administrador: ' + error.message });
    }
}

const getAllAdmins = async (req, res) => {
    try {
        const admins =  await adminService.getAllAdmins();
        res.status(200).json(admins);
    } catch {
        res.status(500).json({ message: 'Error al obtener los admins'})
    }
}

export default{
    startRegistration,
    verifyAndActivate,
    loginAdmin,
    requestPasswordReset,
    resetPassword,
    getCurrentAdmin,
    updateCurrentAdmin,
    
    getAllAdmins,
};