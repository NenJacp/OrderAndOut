////////////////////////////////////////////////////////////
//                     Admin Model                       ///
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
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
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validación básica para un correo
            },
            message: props => `${props.value} no es un correo válido!`
        }
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
        default: false
    },
    verificationCode: {
        type: String,
        default: null
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

// Exportaciones
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
