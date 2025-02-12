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
    
    if (!req.user?.restaurant) {
        return res.status(400).json({ 
            message: 'Restaurante no asignado' 
        });
    }

    try {
        const hashedPassword = await hasher(password);
        const newKiosk = await kioskRepository.createKiosk({
            paymentType,
            password: hashedPassword,
            restaurantId: req.user.restaurant
        });
        res.status(201).json({
            _id: newKiosk._id, // ← Ahora se usa el ID automático de MongoDB
            paymentType: newKiosk.paymentType
        });
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
    const { id, password } = req.body; // ← Cambiar de 'serial' a 'id'

    if (!id || !password) {
        return res.status(400).json({ message: 'ID y contraseña requeridos' });
    }

    try {
        const kiosk = await Kiosk.findById(id).populate('restaurantId');
        if (!kiosk) {
            return res.status(404).json({ message: 'Kiosko no encontrado' });
        }

        const isPasswordValid = await comparer(password, kiosk.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { 
                id: kiosk._id.toString(),
                type: 'kiosk',
                restaurant: kiosk.restaurantId._id.toString()
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ 
            token,
            kioskId: kiosk._id,
            restaurantId: kiosk.restaurantId._id
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