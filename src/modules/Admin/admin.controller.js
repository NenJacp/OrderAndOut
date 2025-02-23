const adminService = require('./admin.service'); // Importar el repositorio
const authService = require('../Auth/auth.service'); // Importar el servicio de autenticación
const emailService = require('../Auth/email.service'); // Importar el servicio de envío de correo

//////////////////////////////////////////////////////////////////////////////////////////
//              █ █ ▄▀▀ ██▀ █▀▄   ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █   █   ██▀ █▀▄ ▄▀▀          //
//              ▀▄█ ▄██ █▄▄ █▀▄   ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄ █▄▄ █▄▄ █▀▄ ▄██          // 
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Función para iniciar el registro de un administrador
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} startRegistration
 */
const startRegistration = async (req, res) => {

    /**
     * @description Obtener los datos del administrador
     * @const {string}  firstName
     * @const {string}  lastName
     * @const { date }  birthDate
     * @const {string}  phone
     * @const {string}  email
     * @const {string}  password
     */
    const { firstName, lastName, birthDate, phone, email, password } = req.body;

    /**
     * @description Intentar registrar el administrador
     */
    try {

        /**
         * @description Eliminar cualquier registro previo no verificado con el mismo email o teléfono
         * @param {string} email
         * @param {string} phone
         * @const {<promise>object} existingVerified
         */
        await adminService.deleteUnverifiedAdmins(email, phone);

        /**
         * @description Buscar un administrador verificado con el mismo email o teléfono
         * @param {string} email
         * @param {string} phone
         * @const {<promise>object} existingVerified
         */
        const existingVerified = await adminService.findVerifiedAdmin(email, phone);

        /**
         * @description Si existe un administrador verificado con el mismo email o teléfono, devolver un error
         * @param {object} existingVerified
         */
        if (existingVerified) {

            const conflictField = existingVerified.email === email ? 'correo' : 'teléfono';
            return res.status(400).json({ 
                message: `El ${conflictField} ya está registrado y verificado`
            });
        }

        /**
         * @description Generar un código de verificación aleatorio
         * @const {string} verificationCode
         */
        const verificationCode = authService.generateCode();

        /**
         * @description Hashear la contraseña
         * @param {string} password
         * @const {<promise>string} hashedPassword
         */
        const hashedPassword = await authService.hasher(password);

        /**
         * @description Crear un nuevo administrador
         * @param {string} firstName
         * @param {string} lastName
         * @param { date } birthDate
         * @param {string} email
         * @param {string} phone
         * @param {string} password
         * @param {string} verificationCode
         * @param { date } codeExpires
         * @const {<promise>object} newAdmin
        */
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

        /**
         * @description Enviar el código de verificación al correo del administrador
         * @param {string} email
         * @param {string} verificationCode
         */
        await emailService.sendVerificationEmail(email, verificationCode);
        
        /**
         * @description Devolver el ID temporal del administrador
         * @const {string} tempId
         */
        res.status(200).json({ tempId: newAdmin._id });
        
    } catch (error) {

        /**
         * @description Devolver un error
         * @const {string} error.message
         */
        res.status(500).json({ message: 'Error al registrar el administrador' + error.message });
    }
};

/**
 * @description Función para verificar y activar una cuenta de administrador
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} verifyAndActivate
 */
const verifyAndActivate = async (req, res) => {

    /**
     * @description Obtener el ID temporal y el código de verificación del administrador
     * @param {string} tempId
     * @param {string} code
     */
    const { tempId, code } = req.body;

    /**
     * @description Intentar verificar y activar la cuenta del administrador
     */
    try {

        /**
         * @description Buscar un administrador con el código de verificación
         * @param {string} tempId
         * @param {string} code
         * @const {<promise>object} admin
         */
        const admin = await adminService.findAdminWithCode(tempId, code);

        /**
         * @description Si no existe un administrador con el código de verificación, devolver un error
         * @param {object} admin
         */
        if (!admin) {
            try {

                /**
                 * @description Devolver un error
                 * @const {string} error.message
                 */
                return res.status(400).json({ message: 'Código inválido o expirado (1 hora de validez)' + error.message });
            } catch (error) {

                /**
                 * @description Devolver un error
                 * @const {string} error.message
                 */
                return res.status(400).json({ message: 'Código inválido o expirado (1 hora de validez)' + error.message });
            }
        }

        /**
         * @description Actualizar la verificación del administrador
         * @param {string} tempId
         * @param {object} admin
         */
        await adminService.updateAdminVerification(tempId, {
            isVerified: true, // Verificar la cuenta
            verificationCode: undefined, // Eliminar el código de verificación
            codeExpires: undefined // Eliminar la fecha de expiración del código de verificación
        });

        /**
         * @description Devolver un mensaje de éxito
         * @const {string} message
         */
        res.status(201).json({ message: 'Cuenta activada exitosamente' });
    } catch (error) {
        
        /**
         * @description Devolver un error   
         * @const {string} error.message
         */
        res.status(500).json({ 
            message: `Error al activar la cuenta: ${error.message}`
        });
    }
};

/**
 * @description Función para iniciar sesión como administrador
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} loginAdmin
 */
const loginAdmin = async (req, res) => {

    /**
     * @description Obtener el email y la contraseña del administrador
     * @param {string} email
     * @param {string} password
     */ 
    const { email, password } = req.body;

    /**
     * @description Intentar iniciar sesión como administrador
     */ 
    try {
        
        /**
         * @description Buscar un administrador por email
         * @param {string} email
         * @const {<promise>object} admin
         */
        const admin = await adminService.getAdminByEmail(email);
        
        /**
         * @description Si no existe un administrador, devolver un error
         * @param {object} admin
         */
        
        if (!admin) {
            
            return res.status(401).json({ message: 'Credenciales inválidas' });
            
        }
        
        /**
         * @description Si el administrador no está verificado, devolver un error
         * @param {object} admin
         */
        
        if (!admin.isVerified) {
            return res.status(403).json({ message: 'Cuenta no verificada' });
        }
        
        /**
         * @description Verificar si la contraseña es válida
         * @param {string} password
         * @param {string} admin.password
         * @const {<promise>boolean} isPasswordValid
         */
        const isPasswordValid = await authService.comparer(password, admin.password);
        /**
         * @description Si la contraseña no es válida, devolver un error
         * @param {boolean} isPasswordValid
         */
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        /**
         * @description Obtener datos frescos del administrador
         * @param {string} admin._id
         * @const {<promise>object} currentAdmin
         */ 
        const currentAdmin = await adminService.getAdminById(admin._id);
        /**
         * @description Generar un token actualizado de autenticación
         * @param {string} admin._id
         * @const {<promise>string} token
         */
        const token = authService.generateAdminAuthToken({
            id: admin._id.toString(), // Convertir el ID a una cadena
            type: 'admin', // Tipo de usuario
            restaurant: currentAdmin.restaurant?.toString() // Convertir el ID del restaurante a una cadena
        });
        /**
         * @description Devolver el token actualizado de autenticación
         * @const {string} token
         */
        res.status(200).json({ token });
    } catch (error) {
        
        /**
         * @description Devolver un error
         * @const {string} error.message
         */
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

/**
 * @description Función para solicitar un restablecimiento de contraseña
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} requestPasswordReset
 */
const requestPasswordReset = async (req, res) => {

    /**
     * @description Obtener el email del administrador
     * @param {string} email
     */
    const { email } = req.body;

    /**
     * @description Intentar solicitar un restablecimiento de contraseña
     */ 
    try {

        /**
         * @description Buscar un administrador por email
         * @param {string} email
         * @const {<promise>object} admin
         */
        const admin = await adminService.getAdminByEmail(email);
        
        /**
         * @description Si no existe un administrador, devolver un error
         * @param {object} admin
         */
        if (!admin) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        /**
         * @description Generar un código de restablecimiento de contraseña aleatorio
         * @const {string} resetCode
         */ 
        const resetCode = authService.generateCode();

        /**
         * @description Actualizar el administrador con el código de restablecimiento de contraseña
         * @param {string} admin._id
         */
        await adminService.updateAdminById(admin._id, {
            resetPasswordCode: resetCode, // Actualizar el código de restablecimiento de contraseña
            resetPasswordExpires: Date.now() + 600000 // 10 minutos
        });

        /**
         * @description Enviar el código de restablecimiento de contraseña al correo del administrador
         * @param {string} email
         * @param {string} resetCode
         */
        await emailService.sendPasswordResetEmail(email, resetCode);
        
        /**
         * @description Devolver un mensaje de éxito
         * @const {string} message
         */
        res.status(200).json({ message: 'Código de recuperación enviado' });
    } catch (error) {

        /**
         * @description Devolver un error
         * @const {string} error.message
         */
        res.status(500).json({ 
            message: `Error al enviar el código de recuperación: ${error.message}` 
        });
    }
};

/**
 * @description Función para restablecer la contraseña de un administrador
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} resetPassword
 */
const resetPassword = async (req, res) => {

    /**
     * @description Obtener el email, el código y la nueva contraseña del administrador
     * @param {string} email
     * @param {string} code
     * @param {string} newPassword
     */
    const { email, code, newPassword } = req.body;

    /**
     * @description Intentar restablecer la contraseña del administrador
     */
    try {

        /**
         * @description Buscar un administrador por email y código de restablecimiento de contraseña
         * @param {string} email
         * @param {string} code
         * @const {<promise>object} admin
         */
        const admin = await adminService.findAdminForReset(email, code);

        /**
         * @description Si no existe un administrador, devolver un error
         * @param {object} admin
         */ 
        if (!admin) {
            return res.status(400).json({ message: 'Código inválido o expirado' + error.message });
        }

        /**
         * @description Hashear la nueva contraseña
         * @param {string} newPassword
         * @const {<promise>string} hashedPassword
         */
        const hashedPassword = await authService.hasher(newPassword);

        /**
         * @description Actualizar el adminis   trador con la nueva contraseña
         * @param {string} admin._id
         */
        await adminService.updateAdminById(admin._id, {
            password: hashedPassword, // Hashear la nueva contraseña
            resetPasswordCode: undefined, // Eliminar el código de restablecimiento de contraseña
            resetPasswordExpires: undefined // Eliminar la fecha de expiración del código de restablecimiento de contraseña
        });

        /**
         * @description Devolver un mensaje de éxito
         * @const {string} message
         */
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {

        /**
         * @description Devolver un error
         * @const {string} error.message
         */
        res.status(500).json({ message: 'Error al actualizar la contraseña' + error.message });
    }
};

/**
 * @description Función para obtener un administrador por ID usando JWT
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} getAdminByIdJWT
 */
const getAdminByJWT = async (req, res) => {

    /**
     * @description Intentar obtener un administrador por ID usando JWT
     */
    try {
        
        /** 
         * @description Obtener el ID del administrador usando JWT
         * @param {string} req.user.id
         */
        const adminId = req.user.id;
        
        /**
         * @description Buscar administrador usando el ID del JWT
         * @param {string} adminId
         * @const {<promise>object} admin
         */
        const admin = await adminService.getAdminById(adminId);

        /**
         * @description Si no existe un administrador, devolver un error
         * @param {object} admin
         */
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' + error.message });
        }

        /**
         * @description Devolver el administrador encontrado
         * @const {object} admin
         */
        res.status(200).json(admin);
    } catch (error) {

        /**
         * @description Devolver un error
         * @const {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener el administrador: ' + error.message });
    }
}

/**
 * @description Función para actualizar los detalles de un administrador usando JWT
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} updateAdminByJWT
 */
const updateAdminByJWT = async (req, res) => {

    /**
     * @description Intentar actualizar los detalles de un administrador usando JWT
     */
    try {

        /**
         * @description Obtener el ID del administrador usando JWT  
         * @param {string} req.user.id
         */
        const adminId = req.user.id;
        
        /**
         * @description Actualizar usando el ID del JWT
         * @param {string} adminId
         * @param {object} req.body
         * @const {<promise>object} updatedAdmin
         */ 
        const updatedAdmin = await adminService.updateAdminById(adminId, req.body);

        /**
         * @description Devolver el administrador actualizado
         */ 
        res.status(200).json(updatedAdmin);
    } catch (error) {

        /**
         * @description Devolver un error
         */
        res.status(500).json({ message: 'Error al actualizar el administrador: ' + error.message });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////
//  █▀▄ ██▀ █ █ ██▀ █   ▄▀▄ █▀▄ ██▀ █▀▄   ▄▀▀ ▄▀▄ █▄ █ ▀█▀ █▀▄ ▄▀▄ █   █   ██▀ █▀▄ ▄▀▀  //
//  █▄▀ █▄▄ ▀▄▀ █▄▄ █▄▄ ▀▄▀ █▀  █▄▄ █▀▄   ▀▄▄ ▀▄▀ █ ▀█  █  █▀▄ ▀▄▀ █▄▄ █▄▄ █▄▄ █▀▄ ▄██  //
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Función para obtener todos los administradores con paginación
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} getAllAdmins
 */
const getAllAdmins = async (req, res) => {

    /**
     * @description Intentar obtener todos los administradores con paginación
     */ 
    try {

        /**
         * @description Obtener página y límite de la consulta, si no se envía nada, por defecto es page 1 y limit 10
         * @const {number} page
         * @const {number} limit
         */
        const { page = 1, limit = 10 } = req.query; 

        /**
         * @description Obtener todos los administradores con paginación
         * @param {number} page
         * @param {number} limit
         * @const {<promise>object} admins
         */
        const admins = await adminService.getAllAdmins(page, limit);

        /**
         * @description Devolver la lista de administradores con paginación
         * @const {object} admins
         */
        res.status(200).json(admins);
    } catch (error) {

        /**
         * @description Devolver un error
         * @const {string} error.message
         */ 
        res.status(500).json({ message: 'Error al obtener administradores' + error.message });
    }
};

/**
 * @description Función para obtener un administrador por ID
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} getAdminById
 */
const getAdminById = async (req, res) => {

    /**
     * @description Intentar obtener un administrador por ID
     */
    try {

        /**
         * @description Buscar un administrador por ID
         * @param {string} req.params.id
         * @const {<promise>object} admin
         */
        const admin = await adminService.getAdminById(req.params.id);

        /**
         * @description Si no existe un administrador, devolver un error
         * @param {object} admin
         */
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' + error.message });
        }

        /**
         * @description Devolver el administrador encontrado
         * @const {object} admin
         */
        res.status(200).json(admin);
    } catch (error) {

        /**
         * @description Devolver un error
         * @const {string} error.message
         */
        res.status(500).json({ message: 'Error al obtener el administrador' + error.message });
    }
}

/**
 * @description Función para actualizar los detalles de un administrador
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} updateAdminByID
 */
const updateAdminById = async (req, res) => {

    /**
     * @description Intentar actualizar los detalles de un administrador
     */ 
    try {

        /**
         * @description Actualizar los detalles de un administrador
         */
        const updatedAdmin = await adminService.updateAdminById(req.params.id, req.body); // Llamar al repositorio para actualizar administrador
        
        /**
         * @description Si no existe un administrador, devolver un error
         */
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Administrador no encontrado' + error.message }); // Manejo de no encontrado
        }

        /**
         * @description Devolver el administrador actualizado
         */
        res.status(200).json(updatedAdmin); // Responder con el administrador actualizado
    } catch (error) {

        /**
         * @description Devolver un error
         */
        res.status(500).json({ message: 'Error al actualizar el administrador' + error.message }); // Manejo de errores
    }
}



/**
 * @description Función para eliminar un administrador
 * @param {object} req
 * @param {object} res
 * @const {<promise>object} deleteAdminByID
 */
const deleteAdminById = async (req, res) => {

    /**
     * @description Intentar eliminar un administrador
     */ 
    try {

        /**
         * @description Obtener el ID del administrador
         */
        const adminId = req.params.id; // Ejemplo: /api/admins/12345
        
        /**
         * @description Intentar eliminar el administrador
         */
        const deletedAdmin = await adminService.deleteAdminById(adminId);
        
        /**
         * @description Si no existe un administrador, devolver un error
         */
        if (!deletedAdmin) {
            return res.status(404).json({ message: `Administrador con ID ${adminId} no encontrado` });
        }

        /**
         * @description Devolver una respuesta exitosa sin contenido
         */
        res.status(204).send(); // Respuesta exitosa sin contenido
    } catch (error) {

        /**
         * @description Devolver un error
         */
        res.status(500).json({ message: 'Error al eliminar el administrador: ' + error.message });
    }
}

/**
 * @description Exportar las funciones para su uso en otros módulos
 */
module.exports = {
    startRegistration,
    verifyAndActivate,
    loginAdmin,
    requestPasswordReset,
    resetPassword,
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
    getAdminByJWT,
    updateAdminByJWT
};