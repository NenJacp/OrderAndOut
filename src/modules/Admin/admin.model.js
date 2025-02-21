const mongoose = require('mongoose'); // Importación de mongoose

/**
 * @description Definición del esquema para el modelo de administrador
 */
const adminSchema = new mongoose.Schema({
    // Campo para el nombre
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    // Campo para el apellido
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    // Campo para la fecha de nacimiento
    birthDate: {
        type: Date,
        required: true,
    },
    // Campo para el número de teléfono
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
    // Campo para el correo electrónico
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
    },
    // Campo para la contraseña
    password: {
        type: String,
        required: true,
    },
    // Campo para la referencia al restaurante
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        default: null
    },
    // Campo para indicar si el administrador está verificado
    isVerified: {
        type: Boolean,
        default: false,
    },
    // Campo para el código de verificación
    verificationCode: {
        type: String,
        index: true,
        expires: 3600
    },
    // Campo para la fecha de expiración del código de verificación
    codeExpires: {
        type: Date,
        default: null
    },
    // Campo para el código de restablecimiento de contraseña
    resetPasswordCode: {
        type: String,
        default: null
    },
    // Campo para la fecha de expiración del código de restablecimiento de contraseña
    resetPasswordExpires: {
        type: Date,
        default: null
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
 * @description Creación de un índice compuesto para búsquedas rápidas
 */
adminSchema.index({ email: 1, phone: 1, isVerified: 1 });

/**
 * @description Exportación del modelo de administrador
 */
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
