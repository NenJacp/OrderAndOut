import stripeService from './stripe.service.js';
import orderService from '../Order/order.service.js';
import StripeAccount from './stripe.model.js';
import Restaurant from '../Restaurant/restaurant.model.js';

/**
 * @description Crear enlace de onboarding para restaurante
 */
const createStripeConnectLink = async (req, res) => {
    try {
        const { refreshUrl, returnUrl } = req.body;
        
        // Verificar permisos
        if (req.user.type !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso no autorizado'
            });
        }
        
        const restaurantId = req.user.restaurant;
        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: 'No tienes un restaurante asignado'
            });
        }
        
        // Generar enlace
        const accountLink = await stripeService.createAccountLink(
            restaurantId,
            refreshUrl || `${process.env.FRONTEND_URL}/stripe/refresh`,
            returnUrl || `${process.env.FRONTEND_URL}/stripe/success`
        );
        
        res.status(200).json({
            success: true,
            url: accountLink.url
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al generar enlace',
            error: error.message
        });
    }
};

/**
 * @description Verificar estado de cuenta Stripe
 */
const checkStripeStatus = async (req, res) => {
    try {
        const restaurantId = req.user.restaurant;
        
        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: 'No tienes un restaurante asignado'
            });
        }
        
        const status = await stripeService.checkAccountStatus(restaurantId);
        
        res.status(200).json({
            success: true,
            ...status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar estado',
            error: error.message
        });
    }
};

/**
 * @description Procesar pago de orden con Stripe
 */
const processPayment = async (req, res) => {
    try {
        const { orderId, paymentMethodId } = req.body;
        
        if (!orderId || !paymentMethodId) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere orderId y paymentMethodId'
            });
        }
        
        // Obtener orden
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }
        
        // Validar que la orden pertenezca al restaurante correcto
        if (order.restaurantId.toString() !== req.user.restaurant) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para procesar este pago'
            });
        }
        
        // Procesar pago
        const paymentIntent = await stripeService.processPayment(
            orderId,
            paymentMethodId,
            order.totalSale,
            order.restaurantId
        );
        
        // Actualizar orden
        await orderService.updateOrderById(orderId, {
            paymentStatus: 'pagado',
            stripePaymentId: paymentIntent.id
        });
        
        res.status(200).json({
            success: true,
            paymentId: paymentIntent.id,
            status: paymentIntent.status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al procesar pago',
            error: error.message
        });
    }
};

/**
 * @description Webhook para recibir eventos de Stripe
 */
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Error de firma de webhook: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    try {
        // Manejar eventos específicos
        switch (event.type) {
            case 'account.updated':
                const account = event.data.object;
                
                // Actualizar cuenta en la base de datos
                await updateStripeAccountStatus(account);
                break;
                
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await handlePaymentSuccess(paymentIntent);
                break;
                
            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                await handlePaymentFailure(failedPayment);
                break;
                
            // Puedes manejar más eventos según sea necesario
            default:
                console.log(`Evento no manejado: ${event.type}`);
        }
        
        // Responder a Stripe que el webhook se procesó correctamente
        res.json({received: true});
    } catch (error) {
        console.error(`Error procesando webhook: ${error.message}`);
        res.status(500).send(`Error procesando webhook: ${error.message}`);
    }
};

/**
 * @description Actualizar el estado de la cuenta Stripe en la base de datos
 */
const updateStripeAccountStatus = async (account) => {
    try {
        // Buscar la cuenta Stripe por ID
        const stripeAccount = await StripeAccount.findOne({ stripeAccountId: account.id });
        
        if (!stripeAccount) {
            console.error(`Cuenta Stripe no encontrada: ${account.id}`);
            return;
        }
        
        // Actualizar estado
        stripeAccount.payoutsEnabled = account.payouts_enabled;
        stripeAccount.chargesEnabled = account.charges_enabled;
        stripeAccount.detailsSubmitted = account.details_submitted;
        
        // Guardar cambios
        await stripeAccount.save();
        
        // Actualizar referencia en el restaurante
        await Restaurant.findByIdAndUpdate(
            stripeAccount.restaurantId,
            { stripeAccount: stripeAccount._id }
        );
        
        console.log(`Cuenta Stripe actualizada: ${account.id}`);
    } catch (error) {
        console.error(`Error actualizando cuenta Stripe: ${error.message}`);
        throw error;
    }
};

/**
 * @description Maneja pagos exitosos
 */
const handlePaymentSuccess = async (paymentIntent) => {
    try {
        const { orderId } = paymentIntent.metadata;
        if (!orderId) {
            console.error('No hay ID de orden en los metadatos del PaymentIntent');
            return;
        }
        
        // Actualizar estado de la orden
        const Order = await import('../Order/order.model.js').then(m => m.default);
        const order = await Order.findById(orderId);
        
        if (!order) {
            console.error(`Orden no encontrada: ${orderId}`);
            return;
        }
        
        // Cambiar el estado de la orden a "preparando"
        order.paymentStatus = 'preparando'; // Cambiar a "preparando" al recibir el pago
        order.status = 'preparando'; // Cambiar el estado de la orden
        order.stripePaymentId = paymentIntent.id; // Guardar el ID del pago
        
        await order.save();
        console.log(`Pago completado para la orden: ${orderId}`);
    } catch (error) {
        console.error(`Error procesando pago exitoso: ${error.message}`);
        throw error;
    }
};

/**
 * @description Maneja pagos fallidos
 */
const handlePaymentFailure = async (paymentIntent) => {
    try {
        const { orderId } = paymentIntent.metadata;
        if (!orderId) {
            console.error('No hay ID de orden en los metadatos del PaymentIntent');
            return;
        }
        
        // Actualizar estado de la orden
        const Order = await import('../Order/order.model.js').then(m => m.default);
        const order = await Order.findById(orderId);
        
        if (!order) {
            console.error(`Orden no encontrada: ${orderId}`);
            return;
        }
        
        order.paymentStatus = 'fallido';
        await order.save();
        console.log(`Pago fallido para la orden: ${orderId}`);
    } catch (error) {
        console.error(`Error procesando pago fallido: ${error.message}`);
        throw error;
    }
};

export default {
    createStripeConnectLink,
    checkStripeStatus,
    processPayment,
    handleStripeWebhook
}; 