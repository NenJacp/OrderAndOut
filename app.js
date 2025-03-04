import express from 'express';
import connectDB from './src/config/mongoDB.js'; // Importar la conexión a MongoDB
import adminRouter from './src/modules/Admin/admin.routes.js'; // Importar las rutas de administradores
import restaurantRouter from './src/modules/Restaurant/restaurant.routes.js'; // Importar las rutas de restaurantes
import kioskRouter from './src/modules/Kiosk/kiosk.routes.js'; // Importar las rutas de kioskos
import orderRouter from './src/modules/Order/order.routes.js'; // Importar las rutas de órdenes
import productRouter from './src/modules/Product/product.routes.js'; // Importar las rutas de productos
import categoriesRouter from './src/modules/Category/category.routes.js'; // Importar las rutas de categorías
import cleanupJob from './src/config/cleanup.js';
import cors from 'cors';

// Conexion a la base de datos
connectDB();

const app = express(); // Crear una instancia de la aplicación Express

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json()); // Usar la instancia de la aplicación

// Configurar CORS ( Acceso a la API desde cualquier origen)
app.use(cors({ // Usar la instancia de la aplicación
  origin: '*', // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos 
}));

// Rutas
app.use('/api/admins', adminRouter); // Usar la instancia de la aplicación
app.use('/api/restaurants', restaurantRouter); // Usar la instancia de la aplicación
app.use('/api/kiosks', kioskRouter); // Usar la instancia de la aplicación
app.use('/api/orders', orderRouter); // Usar la instancia de la aplicación
app.use('/api/products', productRouter); // Usar la instancia de la aplicación
app.use('/api/categories', categoriesRouter); // Usar la instancia de la aplicación

// Iniciar limpieza automática
//cleanupJob();

// Puerto
const PORT = process.env.PORT || 5000; // Usar el puerto definido en .env o 5000 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
