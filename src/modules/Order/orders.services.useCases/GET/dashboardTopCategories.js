import Order from '../../order.model.js'; // Importación del modelo

/**
 * @description Servicio que obtiene las categorías más consumidas en un rango de fechas
 * @param {*} startDate recibe la fecha de inicio
 * @param {*} endDate recibe la fecha de fin
 * @param {*} restaurantId recibe el id del restaurante
 * @returns retorna un array con las 5 categorías más consumidas
 */
const execute = async (startDate, endDate, restaurantId) => {
    
    const endDateAdjusted = new Date(endDate);
    endDateAdjusted.setHours(23, 59, 59, 999); // Ajusta la hora del endDate

    // Obtener órdenes finalizadas del restaurante en el rango de fechas
    const orders = await Order.find({
        createdAt: {
            $gte: new Date(startDate),
            $lte: endDateAdjusted
        },
        restaurantId,
        status: 'finalizado' // Filtrar solo órdenes finalizadas
    });

    

    // Contar las categorías consumidas
    const categoryCount = {};

    orders.forEach(order => {
        
        const uniqueCategories = new Set(); // Usar un Set para evitar contar la misma categoría más de una vez por orden

        order.products.forEach(product => {
            const categoryId = product.productId; // Asegúrate de que 'productId' sea la propiedad correcta
            if (categoryId) {
                uniqueCategories.add(categoryId); // Agregar la categoría al Set
            }
        });

        // Contar cuántas órdenes incluyen cada categoría
        uniqueCategories.forEach(category => {
            categoryCount[category] = (categoryCount[category] || 0) + 1; // Contar la categoría
        });
    });

    // Convertir el conteo a un formato más legible
    const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor
        .slice(0, 5) // Obtener las 5 más consumidas
        .map(([category, count]) => ({ category, count })); // Extraer nombres de las categorías y su conteo

    return topCategories;
};

export default execute; 