import express from 'express';
import CustomerController from './customer.controller.js';

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/', CustomerController.createCustomer);

export default router; 