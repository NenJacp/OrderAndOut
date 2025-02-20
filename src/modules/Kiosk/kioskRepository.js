const Kiosk = require('./kioskModel'); // Importar el modelo de kiosko
const mongoose = require('mongoose');

// Función para crear un nuevo kiosko
const createKiosk = async (kioskData) => {
    const newKiosk = new Kiosk(kioskData);
    return await newKiosk.save(); // Guardar en la base de datos
};

// Función para obtener todos los kioskos por ID del restaurante
const getKiosksByRestaurantId = async (restaurantId) => {
    return await Kiosk.find({ restaurantId }); // Buscar kioskos por ID del restaurante
};

const updateByAdmin = async (kioskId, adminId, updateData) => {
    return await Kiosk.findOneAndUpdate(
        { 
            _id: kioskId,
            restaurantId: { 
                $in: mongoose.model('Restaurant').find({ adminId }).distinct('_id') 
            }
        },
        updateData,
        { new: true, runValidators: true }
    );
};

module.exports = {
    createKiosk,
    getKiosksByRestaurantId,
    updateByAdmin,
};
