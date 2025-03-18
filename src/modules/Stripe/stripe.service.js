import Stripe from 'stripe';
import StripeAccount from './stripe.model.js';
import Restaurant from './../Restaurant/restaurant.model.js';

// Inicializar Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @description Crear un account link para que el restaurante complete su onboarding
 * @param {string} restaurantId ID del restaurante
 * @param {string} refreshUrl URL de redirección si el usuario abandona el proceso
 * @param {string} returnUrl URL de redirección cuando el usuario complete el proceso
 */
const createAccountLink = async (restaurantId, refreshUrl, returnUrl) => {
    try {
        // Buscar si ya existe una cuenta
        let stripeAccount = await StripeAccount.findOne({ restaurantId });
        
        // Si no existe, crear nueva cuenta Stripe
        if (!stripeAccount) {
            const account = await stripe.accounts.create({
                type: 'express',
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true }
                },
                metadata: {
                    restaurantId: restaurantId.toString()
                }
            });
            
            // Guardar referencia en DB
            stripeAccount = await StripeAccount.create({
                restaurantId,
                stripeAccountId: account.id
            });
            
            // Actualizar el modelo de Restaurant con la referencia a la cuenta Stripe
            await Restaurant.findByIdAndUpdate(restaurantId, {
                stripeAccount: stripeAccount._id
            });
        }
        
        // Crear enlace de onboarding
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccount.stripeAccountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding'
        });
        
        return accountLink;
    } catch (error) {
        console.error('Error al crear enlace:', error);
        throw new Error(`Error al crear enlace: ${error.message}`);
    }
};

/**
 * @description Verificar el estado de la cuenta conectada
 * @param {string} restaurantId ID del restaurante
 */
const checkAccountStatus = async (restaurantId) => {
    try {
        const stripeAccount = await StripeAccount.findOne({ restaurantId });
        
        if (!stripeAccount) {
            return { connected: false };
        }
        
        // Obtener estado actual de la cuenta
        const accountDetails = await stripe.accounts.retrieve(stripeAccount.stripeAccountId);
        
        // Actualizar estado en nuestra DB
        stripeAccount.payoutsEnabled = accountDetails.payouts_enabled;
        stripeAccount.chargesEnabled = accountDetails.charges_enabled;
        stripeAccount.detailsSubmitted = accountDetails.details_submitted;
        await stripeAccount.save();
        
        return {
            connected: true,
            accountId: stripeAccount.stripeAccountId,
            payoutsEnabled: accountDetails.payouts_enabled,
            chargesEnabled: accountDetails.charges_enabled,
            detailsSubmitted: accountDetails.details_submitted
        };
    } catch (error) {
        console.error('Error verificando estado:', error);
        throw new Error(`Error al verificar estado: ${error.message}`);
    }
};

/**
 * @description Procesar un pago para una orden
 * @param {string} orderId ID de la orden
 * @param {string} paymentMethodId ID del método de pago del cliente
 * @param {number} amount Monto de la orden
 * @param {string} restaurantId ID del restaurante
 */
const processPayment = async (orderId, paymentMethodId, amount, restaurantId) => {
    try {
        // Obtener cuenta conectada del restaurante
        const stripeAccount = await StripeAccount.findOne({ restaurantId });
        if (!stripeAccount) {
            throw new Error('Restaurante no tiene cuenta Stripe conectada');
        }
        
        if (!stripeAccount.chargesEnabled) {
            throw new Error('Cuenta Stripe no está habilitada para cobros');
        }
        
        // Convertir a centavos
        const amountInCents = Math.round(amount * 100);
        
        // Comisión de plataforma (10%)
        const applicationFee = Math.round(amountInCents * 0.10);
        
        // Crear intent de pago
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'mxn',
            payment_method: paymentMethodId,
            confirm: true,
            application_fee_amount: applicationFee,
            transfer_data: {
                destination: stripeAccount.stripeAccountId,
            },
            metadata: {
                orderId,
                restaurantId
            }
        });
        
        return paymentIntent;
    } catch (error) {
        console.error('Error procesando pago:', error);
        throw new Error(`Error al procesar pago: ${error.message}`);
    }
};

export default {
    createAccountLink,
    checkAccountStatus,
    processPayment
}; 