////////////////////////////////////////////////////////////
//                     Kiosk Repository                  ///
////////////////////////////////////////////////////////////

const Kiosk = require('./kioskModel'); // Importar el modelo de kiosko

// Función para crear un nuevo kiosko
const createKiosk = async (kioskData) => {
    const newKiosk = new Kiosk(kioskData);
    return await newKiosk.save(); // Guardar en la base de datos
};

// Función para obtener todos los kioskos por ID del restaurante
const getKiosksByRestaurantId = async (restaurantId) => {
    return await Kiosk.find({ restaurantId }); // Buscar kioskos por ID del restaurante
};

module.exports = {
    createKiosk,
    getKiosksByRestaurantId,
};
