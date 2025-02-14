////////////////////////////////////////////////////////////
//                MODELO DE ADMINISTRADOR                ///
// Propósito: Gestionar cuentas de administradores con   ///
// sistema de verificación en dos pasos                 ///
// Relaciones:                                          ///
//   - restaurant: Referencia a Restaurant (1:1)       ///
//////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true,
    },
    phone: {
        type: String,
        required: [true, 'El número telefónico es requerido'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\+?(\d{2})?[\s-]?\d{10,15}$/.test(v);
            },
            message: props => `${props.value} no es un número válido!`
        }
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: [true, 'Este correo ya está registrado'],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} no es un correo válido!`
        },
        index: true // Índice para búsquedas rápidas
    },
    password: {
        type: String,
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant',
        default: null
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
        description: 'Indica si completó la verificación por correo'
    },
    verificationCode: {
        type: String,
        description: 'Código temporal de 6 dígitos para verificación',
        index: true,
        expires: 3600 // Autoexpiración en 1 hora
    },
    codeExpires: {
        type: Date,
        default: null
    },
    resetPasswordCode: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
});

// Índice compuesto para búsquedas rápidas
adminSchema.index({ email: 1, isVerified: 1 });

// Exportaciones
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
