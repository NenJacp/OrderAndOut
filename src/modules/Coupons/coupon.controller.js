import couponService from './coupon.service.js';

/**
 * @description Crear un nuevo cupón
 * @param {Object} req
 * @param {Object} res
 */
const createCoupon = async (req, res) => {
    try {
        // Verificar que el usuario sea admin
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para eliminar el kiosko, solo los administradores pueden hacerlo' });
        }    

        // Obtener el ID del restaurante del JWT
        const restaurantId = req.user.restaurant;

        // Intentar generar un código único hasta 10 intentos
        let isDuplicate = true;
        let attempts = 0;
        let couponCode;
        while (isDuplicate && attempts < 10) {
            attempts++;

            // Generar el código del cupón
            const today = new Date();
            const dateCode = today.toISOString().slice(0, 10).replace(/-/g, '').slice(2); // Formato DDMMYY
            const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generar código aleatorio de 6 caracteres
            couponCode = `${dateCode}-${randomCode}`;

            // Verificar que no exista un cupón con el mismo código en la misma fecha
            const existingCoupons = await couponService.getCouponsByRestaurantId(restaurantId);
            isDuplicate = existingCoupons.some(coupon => coupon.code === couponCode);
        }

        if (isDuplicate) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo generar un código único para el cupón después de 10 intentos'
            });
        }

        // Crear el nuevo cupón
        const newCoupon = await couponService.createCoupon({
            ...req.body,
            code: couponCode,
            restaurantId: restaurantId
        });
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el cupón: ' + error.message });
    }
};

/**
 * @description Obtener todos los cupones de un restaurante
 * @param {Object} req
 * @param {Object} res
 */
const getCouponsByRestaurant = async (req, res) => {
    try {
        // Obtener el ID del restaurante del JWT
        const restaurantId = req.user.restaurant;
        const coupons = await couponService.getCouponsByRestaurantId(restaurantId);
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cupones: ' + error.message });
    }
};

/**
 * @description Obtener un cupón específico por ID
 * @param {Object} req
 * @param {Object} res
 */
const getCouponById = async (req, res) => {
    try {
        const coupon = await couponService.getCouponById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cupón: ' + error.message });
    }
};

/**
 * @description Actualizar un cupón por ID
 * @param {Object} req
 * @param {Object} res
 */
const updateCouponById = async (req, res) => {
    try {
        // Verificar que el usuario sea admin
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para eliminar el kiosko, solo los administradores pueden hacerlo' });
        }  
        const updatedCoupon = await couponService.updateCouponById(req.params.id, req.body);
        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }
        res.status(200).json(updatedCoupon);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cupón: ' + error.message });
    }
};

/**
 * @description Eliminar un cupón por ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteCouponById = async (req, res) => {
    try {
        // Verificar que el usuario sea admin
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para eliminar el kiosko, solo los administradores pueden hacerlo' });
        }  
        
        const deletedCoupon = await couponService.deleteCouponById(req.params.id);
        if (!deletedCoupon) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }
        res.status(200).json({ message: 'Cupón eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cupón: ' + error.message });
    }
};

/**
 * @description Obtener un cupón por su código
 * @param {Object} req
 * @param {Object} res
 */
const getCouponByCode = async (req, res) => {
    try {
        const coupon = await couponService.getCouponByCode(req.params.code);
        if (!coupon) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cupón: ' + error.message });
    }
};

/**
 * @description Calcular el descuento aplicable de un cupón
 * @param {Object} req
 * @param {Object} res
 */
const calculateCouponDiscount = async (req, res) => {
    try {
        const code = req.params;
        const subtotal= req.body;

        // Validar que se envió el subtotal
        if (subtotal === undefined || isNaN(subtotal)) {
            return res.status(400).json({ message: 'Se requiere un subtotal válido' });
        }

        // Buscar el cupón por código
        const coupon = await couponService.getCouponByCode(code);
        if (!coupon) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }

        // Calcular el descuento
        let discount = 0;
        if (coupon.type === 'fixed') {
            discount = coupon.discount;
        } else if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.discount) / 100;
        }

        // Redondear a 2 decimales
        discount = Math.round(discount * 100) / 100;

        res.status(200).json({ 
            discount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al calcular el descuento: ' + error.message });
    }
};

export default {
    createCoupon,
    getCouponsByRestaurant,
    getCouponById,
    updateCouponById,
    deleteCouponById,
    getCouponByCode,
    calculateCouponDiscount
}; 