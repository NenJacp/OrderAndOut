import Order from '../../order.model.js'; // Importacion del modelo

/**
 * @description Servicio para borra una orden por medio de la id
 * @param {*} id se recibe la id de la orden que se quiere eliminar
 * @returns
 */
const execute = async (id) => {
    return await Order.findByIdAndDelete(id);
};

export default execute;