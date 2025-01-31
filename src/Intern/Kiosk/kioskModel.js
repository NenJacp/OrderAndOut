////////////////////////////////////////////////////////////
//                     Kiosk Model                       ///
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const kioskSchema = new mongoose.Schema({
    serial: {
        type: String,
        required: true,
        unique: true, // Debe ser único
    },
    creationDate: {
        type: Date,
        default: Date.now, // Fecha de creación por defecto
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Referencia al modelo Restaurant
        required: true,
    },
    paymentType: {
        type: String,
        enum: ['card', 'cash'], // Tipos de pago permitidos
        required: true,
    },
    password: { // Campo para la contraseña
        type: String,
        required: true,
    },
});

const Kiosk = mongoose.model('Kiosk', kioskSchema);
module.exports = Kiosk;
