import Order from '../../order.model.js'; // Importacion del modelo

/**
 * @description servicio para actualizar datos de una orden
 * @param {*} id se recibe el id de la orden a actualizar
 * @param {*} orderData se recibe los datos a actualizar
 * @returns 
 */
const execute = async (id, orderData) => {
    try {
        return await Order.findByIdAndUpdate(id, orderData); // Actualizar una orden
    } catch (error) {
        throw new Error("Error al actualizar la orden");
    }
};

export default execute;