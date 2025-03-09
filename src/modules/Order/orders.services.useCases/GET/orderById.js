import Order from '../../order.model.js'; // Importacion del modelo

/**
 * @description Servicio para obtener una orden por medio de su id
 * @param {*} id recibe el id que se intenta buscar
 * @returns retorna la orden buscada
 */
const execute = async (id) => {
    try {
        return await Order.findById(id); // Obtener una orden específica por ID
    } catch (error) {
        throw new Error("Error al obtener la orden");
    }
};

export default execute;