import orderService from '../../order.service.js';

/**
 * @description Controlador para calcular el total de venta sin crear una orden
 * @param {Object} req 
 * @param {Object} res 
 */
const handle = async (req, res) => {
    try {
        // Obtener los productos del cuerpo de la solicitud
        const productsData = req.body;
        
        // Validar que se recibió un array de productos
        if (!Array.isArray(productsData) || productsData.length === 0) {
            return res.status(400).json({ 
                mensaje: 'Se requiere un array de productos válido' 
            });
        }
        
        // Validar el formato de cada producto
        for (const product of productsData) {
            if (!product.productId || !product.quantity) {
                return res.status(400).json({ 
                    mensaje: 'Cada producto debe tener productId y quantity' 
                });
            }
        }
        
        // Calcular el total de venta
        const totalSale = await orderService.calculateTotalSale(productsData);
        
        // Responder con el total calculado
        res.status(200).json({ totalSale });
    } catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al calcular el total de venta',
            error: error.message 
        });
    }
};

export default handle; 