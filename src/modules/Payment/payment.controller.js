// /controllers/paymentController.js
import { createStripePayment } from "./stripe.service.js";
import Order from '../Order/order.model.js';

export const createPaymentLink = async (req, res) => {
  try {
    const { totalSale, currency } = req.body; // Datos recibidos del frontend (Flutter)

    // Llamamos al servicio de Stripe para crear el enlace de pago
    const paymentUrl = await createStripePayment(totalSale, currency);

    // Enviamos la URL del pago generado
    res.status(200).json({ url: paymentUrl });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    res.status(500).json({ error: "Error al crear el pago" });
  }
};

//quisas quieras modificar orderId o la concurrencia de datos no tuve tiempo de verlo todo 

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature']; // Stripe usa esto para verificar que el webhook es legítimo

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const orderId = session.metadata.numOrder;

            console.log(`✅ Pago recibido para la orden: ${orderId}`);
            
            await Order.findByIdAndUpdate(orderId, { status: "finalizado", paymentId: session.id });

            return res.status(200).json({ success: true, message: "Orden pagada con éxito" });
        }

        res.status(400).json({ success: false, message: "Evento no manejado" });
    } catch (error) {
        console.error("❌ Error en el webhook de Stripe:", error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};