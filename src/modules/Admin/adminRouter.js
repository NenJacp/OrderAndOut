const express = require('express');
const router = express.Router();
const adminController = require('./adminController'); // Importar el controlador
const verifyToken = require('../Auth/authMiddleware'); // Importar el middleware
const restaurantController = require('../Restaurant/restaurantController'); // Importar el controlador de restaurantes

router.post('/login/admin', adminController.loginAdmin);

router.get('/', verifyToken, adminController.getAllAdmins); // Obtener todos los administradores
router.get('/:id', verifyToken, adminController.getAdminById); // Obtener un administrador por ID
router.put('/', verifyToken, adminController.updateAdmin); // Actualizar usando ID del token
router.delete('/:id', verifyToken, adminController.deleteAdmin); // Eliminar un administrador
router.get('/restaurants', verifyToken, restaurantController.getRestaurantsByAdminId); // Obtener restaurantes por adminId desde el token

router.post('/start-register', adminController.startRegistration);

router.post('/verify-account', adminController.verifyAndActivate);
router.post('/forgot-password', adminController.requestPasswordReset);
router.post('/reset-password', adminController.resetPassword);

module.exports = router;
