const mongoose = require('mongoose');

/**
 * @description Definición del esquema de Restaurant
 */
const restaurantSchema = new mongoose.Schema({
    // Campo para el nombre del restaurante
    name: {
        type: String,
        required: true,
    },
    // Campo para la imagen del restaurante
    image: {
        type: String,
        required: true,
    },
    // Campo para la ubicación del restaurante
    location: {
        // Campo para el país
        country: {
            type: String,
            required: true,
        },
        // Campo para la ciudad
        city: {
            type: String,
            required: true,
        },
        // Campo para la dirección del restaurante
        address: {
            street: { type: String, required: true },
            number: { type: String, required: true },
            crossStreets: { type: String, required: true },
            colony: { type: String, required: true },
            references: { type: String, required: true },
        },
        // Campo para el código postal
        postalCode: {
            type: String,
            required: true,
        },
        // Campo para las coordenadas del restaurante
        coordinates: {
            lat: { type: Number, required: false },
            lng: { type: Number, required: false }
        }
    },
    // Campo para el contacto del restaurante
    contact: {
        phone: { type: String, required: false },
        email: { type: String, required: false },
        website: { type: String, required: false },
    },
    // Campo para el administrador del restaurante
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    // Campo para la cuenta de Stripe del restaurante
    stripeAccount: {
        accountId: {
            type: String,
            required: false
        },
        detailsSubmitted: {
            type: Boolean,
            required: false,
            default: false
        },
        chargesEnabled: {
            type: Boolean,
            required: false,
            default: false
        }
    }
},

/**
 * @description Opciones del esquema
 */
{
    // Activación de los timestamps
    timestamps: true
});

/**
 * @description Exportación del modelo de Restaurant
 */
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;