import express from 'express';
import CustomerController from './customer.controller.js';

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/', CustomerController.createCustomer);

// Ruta para verificar el cliente
router.post('/verify', CustomerController.verifyCustomer);

// Ruta para solicitar restablecimiento de contraseña
router.post('/reset-password', CustomerController.requestPasswordReset);

// Ruta para actualizar la contraseña
router.post('/update-password', CustomerController.resetPassword);

export default router; 