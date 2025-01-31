////////////////////////////////////////////////////////////
//                     Product Model                     ///
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true, // Este campo es requerido
    },
    image: {
        type: String,
        required: true, // Este campo es requerido
    },
    price: {
        type: Number, // Usar Number para precios
        required: true,
    },
    availability: {
        type: Boolean,
        default: true, // Disponibilidad por defecto es true
    },
    creationDate: {
        type: Date,
        default: Date.now, // Fecha de creación
    },
    creationTime: {
        type: String, // Hora de creación
        required: true,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Referencia al modelo Restaurant
        required: true,
    },
    ingredients: {
        type: [String], // Array de ingredientes
        default: [],
    },
    category: {
        type: String, // Categoría del producto (opcional)
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;