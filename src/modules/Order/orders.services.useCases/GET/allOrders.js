import Order from '../../order.model.js'; // Importacion del modelo

/**
 * @description Servicio que obtiene todos las ordenes de todos los restaurantes
 * @returns retorna todos los datos 
 */
const execute = async () => {
    return await Order.find(); // Obtener todas las órdenes
};

export default execute;