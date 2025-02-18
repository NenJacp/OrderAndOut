const express = require('express'); // Importación de express
const router = express.Router(); // Creación de un enrutador

const adminController = require('./admin.controller'); // Importar el controlador
const authMiddleware = require('../Auth/auth.middleware'); // Importar el middleware

//////////////////////////////////////////////////////////////////////////////////
//                 █ █ ▄▀▀ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀                    //
//                 ▀▄█ ▄██ █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██                    //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta de registro de administrador
 */
router.post('/start-register', adminController.startRegistration);

/**
 * @description Ruta de verificación de cuenta
 */
router.post('/verify-account', adminController.verifyAndActivate);

/**
 * @description Ruta de inicio de sesión y recuperación de contraseña
 */
router.post('/login/admin', adminController.loginAdmin);

/**
 * @description Ruta de solicitud de restablecimiento de contraseña
 */
router.post('/forgot-password', adminController.requestPasswordReset);

/**
 * @description Ruta de restablecimiento de contraseña
 */
router.post('/reset-password', adminController.resetPassword);

/**
 * @description Ruta para obtener un administrador por JWT
 */
router.get('/me', authMiddleware.verifyToken, adminController.getAdminByJWT);

/**
 * @description Ruta para actualizar un administrador por JWT
 */
router.put('/me', authMiddleware.verifyToken, adminController.updateAdminByJWT);

//////////////////////////////////////////////////////////////////////////////////
//          █▀▄ ██▀ █ █ ██▀ █   ▄▀▄ █▀▄ ██▀ █▀▄   █▀▄ ▄▀▄ █ █ ▀█▀ ██▀ ▄▀▀       //
//          █▄▀ █▄▄ ▀▄▀ █▄▄ █▄▄ ▀▄▀ █▀  █▄▄ █▀▄   █▀▄ ▀▄▀ ▀▄█  █  █▄▄ ▄██       //
//////////////////////////////////////////////////////////////////////////////////

/**
 * @description Ruta para obtener todos los administradores
 */
router.get('/', authMiddleware.verifyDeveloperToken, adminController.getAllAdmins);

/**
 * @description Ruta para obtener un administrador por ID
 */
router.get('/:id', authMiddleware.verifyDeveloperToken, adminController.getAdminById);

/**
 * @description Ruta para actualizar un administrador
 */
router.put('/:id', authMiddleware.verifyDeveloperToken, adminController.updateAdminById);

/**
 * @description Ruta para eliminar un administrador
 */
router.delete('/:id', authMiddleware.verifyDeveloperToken, adminController.deleteAdminById);

module.exports = router;
