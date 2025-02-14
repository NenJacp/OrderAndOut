const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Restaurante es requerido']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    // Índice compuesto para evitar duplicados en el mismo restaurante
    index: { name: 1, restaurantId: 1 }, 
    unique: true 
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category; 