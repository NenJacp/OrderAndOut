const mongoose = require('mongoose');

// Definición del esquema de Kiosk
const kioskSchema = new mongoose.Schema({
    // Campo para la referencia al restaurante
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Referencia al modelo de Restaurant
        required: [true, 'Debe pertenecer a un restaurante'],
        index: true // Índice para optimizar búsquedas por restaurante
    },
    // Campo para el tipo de pago
    paymentType: {
        type: String,
        enum: {
            values: ['card', 'cash'], // Valores permitidos
            message: 'Método de pago inválido (opciones válidas: card, cash)'
        },
        required: [true, 'El tipo de pago es obligatorio']
    },
    // Campo para la contraseña
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        select: false // No se devuelve en consultas por defecto para seguridad
    }
}, { 
    timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

// Exportación del modelo de Kiosk
module.exports = mongoose.model('Kiosk', kioskSchema);
