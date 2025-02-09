////////////////////////////////////////////////////////////
//                     Kiosk Controller                  ///
////////////////////////////////////////////////////////////

const kioskRepository = require('./kioskRepository'); // Importar el repositorio
const Kiosk = require('./kioskModel'); // Importar el modelo de kiosko
const { comparer, hasher } = require('../Auth/authService'); // Importar funciones de comparación y hashing
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const { v4: uuidv4 } = require('uuid'); // Importar la función uuid
require('dotenv').config(); // Cargar variables de entorno

////////////////////////////////////////////////////////////
//                     CREATE SECTION                      ///
////////////////////////////////////////////////////////////

// Función para crear un nuevo kiosko
const createKiosk = async (req, res) => {
    const { paymentType, password } = req.body;
    const restaurantId = req.user.restaurant; // Obtener del token

    if (req.user.restaurant === 'Empty') {
        return res.status(400).json({ message: 'Primero debes crear un restaurante' });
    }

    try {
        const hashedPassword = await hasher(password); // Hashear la contraseña
        const newKiosk = await kioskRepository.createKiosk({
            serial: uuidv4(), // Generar un nuevo serial usando uuid
            paymentType,
            password: hashedPassword, // Guardar la contraseña hasheada
            restaurantId, // Usar restaurantId pasado por parámetro
        });
        res.status(201).json(newKiosk);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para obtener todos los kioskos por ID del restaurante
const getKiosksByRestaurantId = async (req, res) => {
    try {
        const kiosks = await kioskRepository.getKiosksByRestaurantId(req.user.restaurant);
        if (!kiosks || kiosks.length === 0) {
            return res.status(404).json({ message: 'No se encontraron kioskos para este restaurante.' });
        }
        res.status(200).json(kiosks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para iniciar sesión como kiosko
const loginKiosk = async (req, res) => {
    const { serial, password } = req.body;

    if (!serial || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const kiosk = await Kiosk.findOne({ serial }).populate('restaurantId'); // Agregar populate
        if (!kiosk) {
            return res.status(404).json({ message: 'Kiosko no encontrado.' });
        }

        const isPasswordValid = await comparer(password, kiosk.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar token con restaurantId
        const token = jwt.sign(
            { 
                id: kiosk._id.toString(),
                type: 'kiosk',
                restaurant: kiosk.restaurantId._id.toString() // Agregar restaurantId al token
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' } // Cambiar tiempo de expiración a 7 días
        );
        
        res.status(200).json({ 
            token, 
            kioskId: kiosk._id,
            restaurantId: kiosk.restaurantId._id // Enviar también en la respuesta
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createKiosk,
    loginKiosk,
    getKiosksByRestaurantId,
};