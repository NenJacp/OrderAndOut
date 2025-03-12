import orderService from './../../order.service.js'; // Importar el servicio de órdenes
import categoryService from './../../../Category/category.service.js'; // Importar el servicio de categorías
import productService from './../../../Product/product.service.js'; // Importar el servicio de productos

/**
 * @description Controlador para obtener las categorías más consumidas en el dashboard
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const handle = async (req, res) => {
    const restaurantId = req.user.restaurant;
    const { startDate, endDate } = req.query;

    // Validación básica de parámetros
    if (!restaurantId) {
        return res.status(403).json({ message: 'Acceso no autorizado - Restaurante no asignado' });
    }

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Se requieren las fechas de inicio y fin' });
    }

    // Conversión y validación de fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD' });
    }

    if (start >= end) {
        return res.status(400).json({ message: 'La fecha de inicio debe ser menor que la fecha de fin' });
    }

    // Ajuste de hora final
    end.setHours(23, 59, 59, 999);

    try {
        const topCategories = await orderService.getTopCategoriesByDateRangeAndRestaurantId(start, end, restaurantId);
        
        // Obtener los nombres de las categorías
        const categoriesWithNames = await Promise.all(topCategories.map(async (category) => {
            // Primero, obtener el producto usando el ID del producto
            const product = await productService.getProductById(category.category); // Asegúrate de que 'category.category' sea el ID del producto
            const categoryId = product ? product.category : null; // Obtener el ID de la categoría del producto

            // Ahora, buscar el nombre de la categoría usando el ID de la categoría
            const categoryData = categoryId ? await categoryService.getCategoryById(categoryId) : null;

            return {
                category: categoryId, // ID de la categoría
                name: categoryData ? categoryData.name : 'Desconocida', // Nombre de la categoría
                count: category.count // Conteo
            };
        }));

        res.status(200).json({ data: categoriesWithNames });
    } catch (error) {
        console.error('Error en dashboard top categories controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías más consumidas',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}

export default handle;
