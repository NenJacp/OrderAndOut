import stripe from 'stripe'; // Importar Stripe
import Payment from './payment.model.js'; // Importar el modelo de Pago

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY); // Inicializar Stripe con la clave secreta

/**
 * @description Procesar un pago
 * @param {number} total - Monto total a cobrar
 * @param {number} pago - Monto recibido
 * @param {number} cambio - Monto de cambio a devolver
 * @param {string} method - Método de pago (stripe o efectivo)
 * @param {string} currency - Moneda del pago
 * @returns {Promise<object>} - Resultado del pago
 */
const processPayment = async (total, pago, cambio, method, currency) => {
    let paymentIntent;

    if (method === 'stripe') {
        paymentIntent = await stripeClient.paymentIntents.create({
            amount: total * 100, // Stripe espera el monto en centavos
            currency, // Usar la moneda proporcionada
        });
    }

    // Guardar el pago en la base de datos
    const payment = new Payment({
        total,
        pago,
        cambio,
        method,
        currency, // Guardar la moneda
        status: paymentIntent ? paymentIntent.status : 'completed', // Si es efectivo, se considera completado
    });
    await payment.save();

    return paymentIntent || payment; // Retornar el intent de Stripe o el objeto de pago
};

export default {
    processPayment,
}; 