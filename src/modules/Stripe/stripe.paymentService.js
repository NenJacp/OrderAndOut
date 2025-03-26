import Stripe from 'stripe';
import StripeAccount from './stripe.model.js';
import Restaurant from '../Restaurant/restaurant.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @description Genera URL de pago para una orden
 */
const generatePaymentUrl = async (orderId, restaurantId, amount) => {
    try {
        console.log('Generando URL de pago para la orden:', orderId);
        console.log('ID del restaurante:', restaurantId);
        console.log('Monto:', amount);

        // Buscar la cuenta Stripe del restaurante
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurante no encontrado');
        }
        
        // Obtener el StripeAccount del restaurante
        const stripeAccount = await StripeAccount.findOne({ restaurantId });
        console.log('Cuenta Stripe encontrada:', stripeAccount);
        
        if (!stripeAccount || !stripeAccount.chargesEnabled) {
            throw new Error('Cuenta Stripe del restaurante no configurada o no habilitada para pagos');
        }
        
        // Crear un checkout session de Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: `Orden #${orderId.toString()}`,
                            description: `Pago para ${restaurant.name}`,
                        },
                        unit_amount: Math.round(amount * 100), // Convertir a centavos
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'https://orderandout.com'}/payment/success?order_id=${orderId.toString()}`,
            cancel_url: `${process.env.FRONTEND_URL || 'https://orderandout.com'}/payment/cancel?order_id=${orderId.toString()}`,
            payment_intent_data: {
                application_fee_amount: Math.round(amount * 100 * 0.05), // 5% de comisión
                transfer_data: {
                    destination: stripeAccount.stripeAccountId,
                },
                metadata: {
                    orderId: orderId.toString(),
                    restaurantId: restaurantId.toString()
                }
            },
        });
        
        console.log('URL de pago generada:', session.url);
        return session.url;
    } catch (error) {
        console.error('Error generando URL de pago:', error);
        throw error;
    }
};

/**
 * @description Verifica el estado de un pago
 */
const getPaymentStatus = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent.status;
    } catch (error) {
        console.error('Error verificando estado de pago:', error);
        throw error;
    }
};

const getSubscriptionStatus = async (subscriptionId) => {
    try {
        
    } catch (error) {
        console.error('Error verificando estado de suscripción:', error);
        throw error;
    }
}

export default {
    generatePaymentUrl,
    getPaymentStatus
}; 