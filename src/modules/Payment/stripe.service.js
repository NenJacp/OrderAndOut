import Stripe from 'stripe';
import Order from '../Order/order.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Genera un enlace de pago en Stripe
 * @param {Object} order - Orden con el total a cobrar
 */
export const createStripePayment = async (order) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: order.products.map(product => ({
                price_data: {
                    currency: order.currency || "MXN",
                    product_data: {
                        name: product.name,
                        description: `Categoría: ${product.category.name}`,
                    },
                    unit_amount: product.salePrice * 100,
                },
                quantity: product.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/success?orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
                orderId: order._id.toString(),
            }
        });

        return session.url;
    } catch (error) {
        throw new Error("Error creando el enlace de pago: " + error.message);
    }
};

// /**
//  * Verifica el pago recibido desde Stripe Webhook
//  * @param {Object} event - Evento de Stripe
//  */
// export const verifyStripePayment = async (event) => {
//     if (event.type === "checkout.session.completed") {
//         const session = event.data.object;
//         const orderId = session.metadata.orderId;

//         await Order.findByIdAndUpdate(orderId, { status: "finalizado", paymentId: session.id });

//         return { success: true, message: "Orden pagada con éxito" };
//     }

//     return { success: false, message: "Evento no manejado" };
// };
