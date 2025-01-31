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
    const { paymentType, password } = req.body; // Obtener solo los campos necesarios del cuerpo de la solicitud
    const restaurantId = req.params.restaurantId; // Obtener restaurantId de los parámetros de la solicitud
    // Verificar que se proporcionen todos los campos requeridos
    if (!paymentType || !password || !restaurantId) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
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
    const { restaurantId } = req.params;

    try {
        const kiosks = await kioskRepository.getKiosksByRestaurantId(restaurantId);
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

    console.log("Serial:", serial); // Verificar el valor de serial
    console.log("Password:", password); // Verificar el valor de password

    if (!serial || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const kiosk = await Kiosk.findOne({ serial }); // Obtener el kiosko por serial
        if (!kiosk) {
            return res.status(404).json({ message: 'Kiosko no encontrado.' }); // Manejo de no encontrado
        }

        const isPasswordValid = await comparer(password, kiosk.password); // Comparar la contraseña
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' }); // Manejo de contraseña incorrecta
        }

        // Generar un token JWT con solo el ID y tipo
        const token = jwt.sign({ id: kiosk._id, type: 'kiosk' }, process.env.JWT_SECRET); // Agregar tipo de usuario
        res.status(200).json({ token, kioskId: kiosk._id }); // Responder solo con el token
    } catch (error) {
        res.status(500).json({ message: error.message }); // Manejo de errores
    }
};

module.exports = {
    createKiosk,
    loginKiosk,
    getKiosksByRestaurantId,
};
