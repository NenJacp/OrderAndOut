import Order from '../../order.model.js'; // Importacion del modelo

/**
 * @description Servicio paara buscar ordenes que sean de "x" restaurante
 * @param {*} restaurantId recibe el id del restauranta
 * @returns revuelve ordenes que pertenecen al restaurante buscado
 */
const execute = async (restaurantId) => {
    return await Order.find({ restaurantId }); // Obtener órdenes filtradas por restaurantId
};

export default execute;