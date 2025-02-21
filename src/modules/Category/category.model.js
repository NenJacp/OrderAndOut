const mongoose = require('mongoose'); // Importar mongoose

/**
 * @description Definición del esquema de la categoría
 */
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Restaurante es requerido']
    },
},

/**
 * @description Índice compuesto para evitar duplicados en el mismo restaurante
 */
{ 
    index: { name: 1, restaurantId: 1 }, 
    unique: true 
},

/**
 * @description Campos de tiempo
 */
{
    timestamps: true
});

/**
 * @description Modelo de la categoría
 */
const Category = mongoose.model('Category', categorySchema);

/**
 * @description Exportar el modelo de la categoría
 */
module.exports = Category; 