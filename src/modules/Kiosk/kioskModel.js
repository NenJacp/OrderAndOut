////////////////////////////////////////////////////////////
//                MODELO DE TERMINAL POS                 ///
// Propósito: Registrar terminales físicos de venta      //
// Relaciones:
//   - restaurantId: Referencia a Restaurant (1:N)      //
// Validaciones:
//   - paymentType: Solo permite 'card' o 'cash'         //
// Seguridad:
//   - password: Almacenamiento con hash bcrypt         //
// Campos especiales:
//   - timestamps: Registra fecha creación/actualización //
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const kioskSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Debe pertenecer a un restaurante'],
        index: true // Optimiza búsquedas por restaurante
    },
    paymentType: {
        type: String,
        enum: {
            values: ['card', 'cash'],
            message: 'Método de pago inválido (opciones válidas: card, cash)'
        },
        required: [true, 'El tipo de pago es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        select: false // No se devuelve en consultas por defecto
    }
}, { 
    timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Kiosk', kioskSchema);
