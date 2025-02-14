require('dotenv').config(); // Cargar variables de entorno
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const Admin = require('./adminModel'); // Importar el modelo de administrador
const adminRepository = require('./adminRepository'); // Importar el repositorio
const { hasher, comparer } = require('../Auth/authService');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../Auth/emailService'); // Importar el servicio de envío de correo


// Función para generar un código de verificación aleatorio
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Función para iniciar el registro de un administrador
const startRegistration = async (req, res) => {
    const { email, password, phone, firstName, lastName, birthDate } = req.body;

    try {
        // Eliminar cualquier registro previo no verificado con el mismo email o teléfono
        await Admin.deleteMany({
            $or: [
                { email, isVerified: false },
                { phone, isVerified: false }
            ]
        });

        // Verificar si ya existe una cuenta verificada
        const existingVerified = await Admin.findOne({
            $or: [
                { email, isVerified: true },
                { phone, isVerified: true }
            ]
        });
        
        if (existingVerified) {
            const conflictField = existingVerified.email === email ? 'correo' : 'teléfono';
            return res.status(400).json({ message: `El ${conflictField} ya está registrado y verificado` });
        }

        const verificationCode = generateCode();
        const hashedPassword = await hasher(password);

        const newAdmin = await Admin.create({
            firstName,
            lastName,
            birthDate,
            email,
            phone,
            password: hashedPassword,
            verificationCode,
            codeExpires: Date.now() + 3600000,
        });

        await sendVerificationEmail(email, verificationCode);
        res.status(200).json({ tempId: newAdmin._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para verificar y activar una cuenta de administrador
const verifyAndActivate = async (req, res) => {
    const { tempId, code } = req.body;

    try {
        const admin = await Admin.findOne({
            _id: tempId,
            verificationCode: code,
            codeExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Código inválido o expirado (1 hora de validez)' });
        }

        admin.isVerified = true;
        admin.verificationCode = undefined;
        admin.codeExpires = undefined;
        await admin.save();

        res.status(201).json({ message: 'Cuenta activada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al activar la cuenta' });
    }
};

// Función para iniciar sesión como administrador
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar si la cuenta está activa
        if (!admin.isVerified) {
            return res.status(403).json({ message: 'Cuenta no verificada' });
        }

        const isPasswordValid = await comparer(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Obtener el restaurantId actualizado
        const currentAdmin = await Admin.findById(admin._id); // Nueva consulta para obtener datos frescos

        const token = jwt.sign(
            { 
                id: admin._id, 
                type: 'admin',
                restaurant: currentAdmin.restaurant || 'Empty' // Usar valor actualizado
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};


// Ejemplo de función para obtener todos los administradores
const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminRepository.getAllAdmins(); // Llamar al repositorio para obtener todos los administradores
        res.status(200).json(admins); // Responder con la lista de administradores
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener administradores' }); // Manejo de errores
    }
};

// Ejemplo de función para obtener un administrador por ID
const getAdminById = async (req, res) => {
    try {
        const admin = await adminRepository.getAdminById(req.params.id); // Llamar al repositorio para buscar administrador por ID
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' }); // Manejo de no encontrado
        }
        res.status(200).json(admin); // Responder con el administrador encontrado
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
}

// Ejemplo de función para actualizar los detalles de un administrador
const updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await adminRepository.updateAdmin(req.params.id, req.body); // Llamar al repositorio para actualizar administrador
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Administrador no encontrado' }); // Manejo de no encontrado
        }
        res.status(200).json(updatedAdmin); // Responder con el administrador actualizado
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el administrador' }); // Manejo de errores
    }
}

// Ejemplo de función para eliminar un administrador
const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await adminRepository.deleteAdmin(req.params.id); // Llamar al repositorio para eliminar administrador
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Administrador no encontrado' }); // Manejo de no encontrado
        }
        res.status(204).send(); // Sin contenido
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el administrador' }); // Manejo de errores
    }
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const resetCode = generateCode();
        admin.resetPasswordCode = resetCode;
        admin.resetPasswordExpires = Date.now() + 600000; // 10 minutos
        await admin.save();

        await sendPasswordResetEmail(email, resetCode);
        res.status(200).json({ message: 'Código de recuperación enviado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el código de recuperación' });
    }
};

const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    
    try {
        const admin = await Admin.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Código inválido o expirado' });
        }

        admin.password = await hasher(newPassword);
        admin.resetPasswordCode = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
};

module.exports = {
    startRegistration,
    verifyAndActivate,
    loginAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    requestPasswordReset,
    resetPassword,
};
