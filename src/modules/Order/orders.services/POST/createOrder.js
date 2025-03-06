import Order from '../../order.model.js'; // Importacion del modelo

/**
 * @description creacion de una nueva orden del restaurante
 * @param {*} orderData recibe los datos necesarios para la creacion
 * @returns retorna una orden creada
 */
const execute = async (orderData) => {
    const newOrder = new Order(orderData);
    try {
        return await newOrder.save(); // Guardar en la base de datos y lo devuelve
    } catch (error) {
        throw new Error("Error al crear la orden: " + error.message);
    }
};
export default execute;
