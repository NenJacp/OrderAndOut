const mongoose = require('mongoose');

// Definición del esquema de Kiosk
const kioskSchema = new mongoose.Schema({
    // Campo para la referencia al restaurante
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        select: false // No se devuelve en consultas por defecto para seguridad
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Referencia al modelo de Restaurant
        required: [true, 'Debe pertenecer a un restaurante'],
        index: true // Índice para optimizar búsquedas por restaurante
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'disabled'],
        default: 'active'
    },
    connected_at: {
        type: Date,
        default: null
    },
    disconnected_at: {
        type: Date,
        default: null
    },

}, 
{ 
    timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

// Exportación del modelo de Kiosk
module.exports = mongoose.model('Kiosk', kioskSchema);
