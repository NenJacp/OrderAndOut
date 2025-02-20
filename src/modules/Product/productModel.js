////////////////////////////////////////////////////////////
//                     Product Model                     ///
////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    description: {
        type: String,
        required: true, // Este campo es requerido
    },
    image: {
        type: String,
        required: true, // Este campo es requerido
    },
    costPrice: {  
        type: Number,
        required: true,
        min: [0.01, 'El precio de costo debe ser mayor a 0']
    },
    salePrice: {  
        type: Number,
        required: true,
        min: [0.01, 'El precio de venta debe ser mayor a 0'],
        validate: {
            validator: function(v) {
                return v > this.costPrice;
            },
            message: 'El precio de venta debe ser mayor al de costo'
        }
    },
    currency: {
        type: String,
        default: 'MXN',
    },
    availability: {
        type: Boolean,
        default: true,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    ingredients: {
        type: [String], // Array de ingredientes
        default: [],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        validate: {
            validator: async function(categoryId) {
                const category = await mongoose.model('Category').findOne({
                    _id: categoryId,
                    restaurantId: this.restaurantId
                });
                return !!category;
            },
            message: 'La categoría no pertenece a este restaurante'
        }
    },
},
{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;