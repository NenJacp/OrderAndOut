const mongoose = require('mongoose');
const Admin = require('./src/Intern/Admin/adminModel'); // Ajusta la ruta según tu estructura de carpetas
require('dotenv').config(); // Cargar variables de entorno

// Conectar a la base de datos usando la URI de MongoDB desde .env
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a la base de datos');

        // Crear el índice único para el campo email
        try {
            await Admin.createIndexes({ email: 1 }, { unique: true });
            console.log('Índice único creado para el campo email');
        } catch (error) {
            console.error('Error al crear el índice:', error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    }); 