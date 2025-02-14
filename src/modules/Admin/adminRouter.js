////////////////////////////////////////////////////////////
//                     Admin Router                        ///
////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const adminController = require('./adminController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware
const restaurantController = require('../Restaurant/restaurantController'); // Importar el controlador de restaurantes

////////////////////////////////////////////////////////////
//              RUTAS DE ADMINISTRADORES                ///
// Path base: /api/intern/admins                        //
// Requiere autenticación JWT para rutas protegidas     ///
////////////////////////////////////////////////////////////

/**
 * @route POST /login/admin
 * @description Autentica un administrador
 * @access Público
 * @param {String} email - Correo del administrador
 * @param {String} password - Contraseña
 * @returns {Object} - Token JWT y datos del administrador
 */
router.post('/login/admin', adminController.loginAdmin);

router.get('/', verifyToken, adminController.getAllAdmins); // Obtener todos los administradores
router.get('/:id', verifyToken, adminController.getAdminById); // Obtener un administrador por ID
router.put('/:id', verifyToken, adminController.updateAdmin); // Actualizar un administrador
router.delete('/:id', verifyToken, adminController.deleteAdmin); // Eliminar un administrador
router.get('/restaurants', verifyToken, restaurantController.getRestaurantsByAdminId); // Obtener restaurantes por adminId desde el token

/**
 * @route POST /start-register
 * @desc Inicia registro de administrador (envía código por email)
 * @access Public
 * @body {string} email - Correo electrónico
 * @body {string} password - Contraseña (mín. 8 caracteres)
 * @body {string} phone - Teléfono formato internacional
 * @returns {Object} - ID temporal para verificación
 */
router.post('/start-register', adminController.startRegistration);

router.post('/verify-account', adminController.verifyAndActivate);
router.post('/forgot-password', adminController.requestPasswordReset);
router.post('/reset-password', adminController.resetPassword);

module.exports = router;
