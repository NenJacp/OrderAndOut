import express from 'express'; // Importación de express
const router = express.Router(); // Creación de un enrutador

import adminController from './admin.controller.js'; // Importar el controlador
import authMiddleware from '../Auth/auth.middleware.js'; // Importar el middleware


//USERS ROUTES


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
router.get('/me', authMiddleware.verifyTokenMiddleware, adminController.getCurrentAdmin);

/**
 * @description Ruta para actualizar un administrador por JWT
 */
router.put('/me', authMiddleware.verifyTokenMiddleware, adminController.updateCurrentAdmin);


//DEVELOPER ROUTES


/**
 * @description Ruta para obtener todos los administradores
 */
router.get('/', authMiddleware.verifyTokenMiddleware, adminController.getAllAdmins);

export default router;
