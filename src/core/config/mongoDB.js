////////////////////////////////////////////////////////////
//            CONEXIÓN A MONGODB ATLAS                   ///
// Propósito: Establecer conexión segura con la base de datos
// Dependencias:
// - mongoose: ORM para MongoDB
// - dotenv: Manejo de variables de entorno
// Configuración requerida:
// - MONGODB_URI: URI de conexión con credenciales
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB conectado exitosamente');
    } catch (error) {
        console.error('❌ Error de conexión a MongoDB:', error.message);
        process.exit(1); // Fuerza reinicio del servidor en caso de error
    }
};

module.exports = connectDB;
