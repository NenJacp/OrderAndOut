import Order from '../../order.model.js'; // Importación del modelo
import executeTotalCost from './dashboardTotalCost.js'; // Importar servicio para total de costos
import executeTotalSale from './dashboardTotalSale.js'; // Importar servicio para total de ventas

/**
 * @description Servicio que obtiene el total de ganancias de las órdenes finalizadas en un rango de fechas
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna el total de ganancias
 */
const execute = async (startDate, endDate, restaurantId) => {
    const endDateAdjusted = new Date(endDate);
    endDateAdjusted.setHours(23, 59, 59, 999); // Ajusta la hora del endDate

    // Obtener el total de ventas y costos usando los servicios importados
    const totalSale = await executeTotalSale(startDate, endDate, restaurantId);
    const totalCost = await executeTotalCost(startDate, endDate, restaurantId);

    // Calcular las ganancias
    const totalGains = totalSale - totalCost;
    return totalGains;
};

export default execute;
