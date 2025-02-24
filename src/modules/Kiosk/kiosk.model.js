const mongoose = require('mongoose'); // Importar mongoose

/**
 * @description Definición del esquema de Kiosk
 */
const kioskSchema = new mongoose.Schema({
    // Campo para la contraseña
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    },
    // Campo para la referencia al restaurante
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Referencia al modelo de Restaurant
        required: [true, 'Debe pertenecer a un restaurante'],
        index: true // Índice para optimizar búsquedas por restaurante
    },
    // Campo para el estado del kiosk
    status: {
        type: String,
        required: [true, 'El estado es requerido'],
        enum: ['active', 'maintenance', 'disabled'],
        default: 'active'
    },
    // Campo para indicar si el kiosk está conectado
    isConnected: {
        type: Boolean,
        default: false
    },
    // Campo para indicar la fecha de conexión
    connected_at: {
        type: Date,
        default: null
    },
    // Campo para indicar la fecha de desconexión
    disconnected_at: {
        type: Date,
        default: null
    },
    // Campo para indicar la duración del token
    tokenDuration: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(\d+[hdm]|none)$/.test(v);
            },
            message: props => `${props.value} no es un formato válido. Ejemplos: 1h, 2d, none`
        },
        default: '7d'
    },
}, 

/**
 * @description Opciones del esquema
 */
{ 
    // Activación de los timestamps
    timestamps: true
});

/**
 * @description Exportación del modelo de Kiosk
 */
module.exports = mongoose.model('Kiosk', kioskSchema);
