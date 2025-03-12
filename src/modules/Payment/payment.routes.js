import express from 'express'; // Importar express
import paymentController from './payment.controller.js'; // Importar el controlador de pagos

const router = express.Router(); // Crear un router

/**
 * @description Ruta para procesar un pago
 */
router.post('/process', paymentController.processPayment);

export default router; 