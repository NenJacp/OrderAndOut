////////////////////////////////////////////////////////////
//                     Admin Model                       ///
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastNamePaternal: {
        type: String,
        required: true,
    },
    lastNameMaternal: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
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
    }
});

// Exportaciones
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
