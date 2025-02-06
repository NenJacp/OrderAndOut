////////////////////////////////////////////////////////////
//                     Main Application                    ///
////////////////////////////////////////////////////////////

const express = require('express');
const connectDB = require('./src/core/config/mongoDB'); // Importar la conexión a MongoDB
const adminRouter = require('./src/Intern/Admin/adminRouter'); // Importar las rutas de administradores
const restaurantRouter = require('./src/Intern/Restaurant/restaurantRouter'); // Importar las rutas de restaurantes
const kioskRouter = require('./src/Intern/Kiosk/kioskRouter'); // Importar las rutas de kioskos
const orderRouter = require('./src/Intern/Order/orderRouter'); // Importar las rutas de órdenes
const productRouter = require('./src/Intern/Product/productRouter'); // Importar las rutas de productos
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON

// Rutas
app.use('/api/intern/admins', adminRouter); // Usar las rutas de administradores
app.use('/api/intern/restaurants', restaurantRouter); // Usar las rutas de restaurantes
app.use('/api/intern/kiosks', kioskRouter); // Usar las rutas de kioskos
app.use('/api/intern/orders', orderRouter); // Usar las rutas de órdenes
app.use('/api/intern/products', productRouter); // Usar las rutas de productos

// Puerto
const PORT = process.env.PORT || 5000; // Usar el puerto definido en .env o 5000 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
