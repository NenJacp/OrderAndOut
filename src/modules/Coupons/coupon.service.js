import Coupon from './coupon.model.js';

/**
 * @description Crear un nuevo cupón
 * @param {Object} couponData
 * @returns {Promise<Object>}
 */
const createCoupon = async (couponData) => {
    return await Coupon.create(couponData);
};

/**
 * @description Obtener todos los cupones de un restaurante
 * @param {String} restaurantId
 * @returns {Promise<Array>}
 */
const getCouponsByRestaurantId = async (restaurantId) => {
    return await Coupon.find({ restaurantId });
};

/**
 * @description Obtener un cupón específico por ID
 * @param {String} id
 * @returns {Promise<Object>}
 */
const getCouponById = async (id) => {
    return await Coupon.findById(id);
};

/**
 * @description Actualizar un cupón por ID
 * @param {String} id
 * @param {Object} couponData
 * @returns {Promise<Object>}
 */
const updateCouponById = async (id, couponData) => {
    return await Coupon.findByIdAndUpdate(id, couponData, { new: true });
};

/**
 * @description Eliminar un cupón por ID
 * @param {String} id
 * @returns {Promise<Object>}
 */
const deleteCouponById = async (id) => {
    return await Coupon.findByIdAndDelete(id);
};

/**
 * @description Buscar un cupón por su código
 * @param {String} code
 * @returns {Promise<Object>}
 */
const getCouponByCode = async (code) => {
    return await Coupon.findOne({ code });
};

export default {
    createCoupon,
    getCouponsByRestaurantId,
    getCouponById,
    updateCouponById,
    deleteCouponById,
    getCouponByCode
}; 