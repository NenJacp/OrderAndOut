import orderService from '../../order.service.js'; // Importar el servicio de órdenes
import productService from '../../../Product/product.service.js'; // Importar el servicio de productos
import categoryService from '../../../Category/category.service.js'; // Importar el servicio de categorías
import restaurantService from '../../../Restaurant/restaurant.service.js'; // Importar el servicio de restaurantes
import couponService from '../../../Coupons/coupon.service.js';

/**
 * @description Controlador para crear una nueva orden
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {

    /**
     * @description Creación de la orden
     */
    try {
        const orderData = req.body;
        
        // Verificar que customerName exista en el body
        if (!orderData.customerName) {
            return res.status(400).send('El campo customerName es requerido');
        }

        // Obtener los productos y sus precios
        const productsWithDetails = await Promise.all(orderData.products.map(async (product) => {
            const productDetails = await productService.getProductById(product.productId); // Obtener detalles del producto
            if (!productDetails) {
                throw new Error(`Producto no encontrado: ${product.productId}`);
            }
            return {
                productId: product.productId,
                quantity: product.quantity,
                costPrice: productDetails.costPrice,
                salePrice: productDetails.salePrice,
                name: productDetails.name, // Agregar el nombre del producto
                category: {
                    id: productDetails.category, // ID de la categoría
                    name: (await categoryService.getCategoryById(productDetails.category)).name // Obtener el nombre de la categoría
                }
            };
        }));

        // Calcular el totalCost
        const totalCost = productsWithDetails.reduce((total, product) => {
            return total + (product.costPrice * product.quantity);
        }, 0);

        // Calcular el subtotal (antes era totalSale)
        const subtotal = productsWithDetails.reduce((total, product) => {
            return total + (product.salePrice * product.quantity);
        }, 0);

        // Inicializar descuento
        let discount = 0;
        let couponId = null;

        // Verificar si se envió un código de cupón
        if (orderData.coupon) {
            // Buscar cupón por código
            const coupon = await couponService.getCouponByCode(orderData.coupon);

            if (!coupon) {
                return res.status(404).json({ message: 'Cupón no encontrado' });
            }

            // Guardar el ID del cupón
            couponId = coupon._id;

            // Verificar si el cupón pertenece al mismo restaurante que el usuario
            if (coupon.restaurantId.toString() !== req.user.restaurant.toString()) {
                return res.status(403).json({ 
                    message: 'Este cupón no pertenece a tu restaurante',
                    couponRestaurant: coupon.restaurantId,
                    userRestaurant: req.user.restaurant
                });
            }

            // Verificar el estado del cupón
            if (coupon.status === 'expired') {
                return res.status(400).json({ message: 'El cupón ha expirado' });
            } else if (coupon.status === 'consumed') {
                return res.status(400).json({ message: 'El cupón ya ha sido consumido' });
            } else if (coupon.status === 'valid') {
                // Verificar la validez de la fecha
                const now = new Date();
                if (now > new Date(coupon.validity)) {
                    coupon.status = 'expired';
                    await couponService.updateCouponById(coupon._id, { status: 'expired' });
                    return res.status(400).json({ message: 'El cupón ha expirado' });
                }

                // Aplicar el descuento
                if (coupon.type === 'fixed') {
                    discount = coupon.discount; // Descuento fijo
                } else if (coupon.type === 'percentage') {
                    discount = (subtotal * coupon.discount) / 100; // Descuento porcentual
                }

                // Marcar el cupón como consumido
                coupon.status = 'consumed';
                await couponService.updateCouponById(coupon._id, { status: 'consumed' });
            }
        }

        // Calcular el totalSale (subtotal - discount)
        const totalSale = subtotal - discount;
        
        // Obtener el nombre del restaurante
        const restaurantDetails = await restaurantService.getRestaurantById(req.user.restaurant);
        if (!restaurantDetails) {
            throw new Error(`Restaurante no encontrado: ${req.user.restaurant}`);
        }

        // Asignar datos adicionales
        orderData.createdById = req.user.id;
        orderData.createdByType = req.user.type;
        orderData.restaurantId = req.user.restaurant;
        orderData.restaurantName = restaurantDetails.name; // Agregar el nombre del restaurante
        orderData.products = productsWithDetails; // Actualizar productos con detalles
        orderData.totalCost = totalCost; // Asignar el totalCost
        orderData.subtotal = subtotal;
        orderData.discount = discount || 0;
        orderData.totalSale = totalSale; // Asignar el totalSale
        orderData.createdByName = req.user.name; // Agregar el nombre del usuario que crea la orden
        
        // Agregar código y ID del cupón si existe
        if (orderData.coupon) {
            orderData.couponId = couponId; // Guardar el ID del cupón
        }

        /**
         * @description Creación de la orden
         * @constant {Object} newOrder
         */
        const newOrder = await orderService.createOrder(orderData);
        
        // Generar URL de pago si se especifica paymentMethod como 'tarjeta'
        if (orderData.paymentMethod === 'tarjeta') {
            try {
                const stripeService = await import('../../../Stripe/stripe.paymentService.js');
                const paymentUrl = await stripeService.default.generatePaymentUrl(
                    newOrder._id,
                    newOrder.restaurantId,
                    newOrder.totalSale // Usar totalSale (después del descuento) para el pago
                );
                
                // Actualizar la orden con la URL de pago
                newOrder.stripePaymentUrl = paymentUrl;
                await newOrder.save();
                
                // Incluir URL de pago en la respuesta
                res.status(201).json({
                    order: newOrder,
                    paymentUrl: paymentUrl
                });
            } catch (error) {
                console.error('Error generando URL de pago:', error);
                // Aún devolver la orden creada aunque falle el pago
                res.status(201).json({
                    order: newOrder,
                    error: `Error generando URL de pago: ${error.message}`
                });
            }
        } else {
            // Si no es pago con tarjeta, simplemente devolver la orden
            res.status(201).json({ order: newOrder });
        }
    } catch (error) {
        res.status(500).send('Error al crear la orden: ' + error.message);
    }
}

export default handle;