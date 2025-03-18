import express from 'express';
import stripeController from './stripe.controller.js';
import authMiddleware from '../Auth/auth.middleware.js';

const router = express.Router();

// Ruta para generar enlace de onboarding
router.post('/onboarding-link', 
    authMiddleware.verifyTokenMiddleware, 
    stripeController.createStripeConnectLink);

// Ruta para verificar estado de la cuenta
router.get('/account-status', 
    authMiddleware.verifyTokenMiddleware, 
    stripeController.checkStripeStatus);

// Ruta para procesar pagos
router.post('/process-payment', 
    authMiddleware.verifyTokenMiddleware, 
    stripeController.processPayment);

// Ruta para webhook (sin verificación de token)
router.post('/webhook', 
    express.raw({type: 'application/json'}),  // Importante: mantener el cuerpo en formato raw
    stripeController.handleStripeWebhook);

export default router; 