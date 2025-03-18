import express from 'express';
import { createPaymentLink, stripeWebhook } from './payment.controller.js';

const router = express.Router();

// Ruta para generar el link de pago
router.post('/stripe/create-payment-link', createPaymentLink);

// Ruta para recibir notificaciones de Stripe (Webhook)
router.post('/stripe/webhooks', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
