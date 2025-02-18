const mongoose = require('mongoose'); // Importación de mongoose

/**
 * @description Definición del esquema para el modelo de administrador
 */
const adminSchema = new mongoose.Schema({
    firstName: {
        type: String, // Tipo de dato: cadena de caracteres
        required: [true, 'El nombre es requerido'], // Requerido, con mensaje de error
        trim: true, // Elimina espacios en blanco al principio y al final
        maxlength: [50, 'El nombre no puede exceder 50 caracteres'] // Límite de longitud
    },
    lastName: {
        type: String, // Tipo de dato: cadena de caracteres
        required: true, // Requerido
        trim: true // Elimina espacios en blanco al principio y al final
    },
    birthDate: {
        type: Date, // Tipo de dato: fecha
        required: true, // Requerido
    },
    phone: {
        type: String, // Tipo de dato: cadena de caracteres
        required: [true, 'El número telefónico es requerido'], // Requerido, con mensaje de error
        unique: true, // Único, no se pueden repetir
        validate: {
            validator: function(v) {
                return /^\+?(\d{2})?[\s-]?\d{10,15}$/.test(v); // Expresión regular para validar el formato del número
            },
            message: props => `${props.value} no es un número válido!` // Mensaje de error
        }
    },
    email: {
        type: String, // Tipo de dato: cadena de caracteres
        required: [true, 'El correo electrónico es obligatorio'], // Requerido, con mensaje de error
        unique: [true, 'Este correo ya está registrado'], // Único, no se pueden repetir, con mensaje de error
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Expresión regular para validar el formato del correo
            },
            message: props => `${props.value} no es un correo válido!` // Mensaje de error
        },
    },
    password: {
        type: String, // Tipo de dato: cadena de caracteres
        required: true, // Requerido
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId, // Tipo de dato: ObjectId de Mongoose
        ref: 'Restaurant', // Referencia al modelo de Restaurante
        default: null // Valor predeterminado
    },
    creationDate: {
        type: Date, // Tipo de dato: fecha
        default: Date.now, // Valor predeterminado: fecha actual
    },
    isVerified: {
        type: Boolean, // Tipo de dato: booleano
        default: false, // Valor predeterminado
        description: 'Indica si completó la verificación por correo' // Descripción
    },
    verificationCode: {
        type: String, // Tipo de dato: cadena de caracteres
        description: 'Código temporal de 6 dígitos para verificación', // Descripción
        index: true, // Índice para búsquedas rápidas
        expires: 3600 // Autoexpiración en 1 hora
    },
    codeExpires: {
        type: Date, // Tipo de dato: fecha
        default: null // Valor predeterminado
    },
    resetPasswordCode: {
        type: String, // Tipo de dato: cadena de caracteres
        default: null // Valor predeterminado
    },
    resetPasswordExpires: {
        type: Date, // Tipo de dato: fecha
        default: null // Valor predeterminado
    },
},

/**
 * @description Opciones del esquema
 */
{
    timestamps: true // Activación de los timestamps
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
