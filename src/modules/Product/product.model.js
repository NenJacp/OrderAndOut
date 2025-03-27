import mongoose from 'mongoose'; // Importar mongoose

/**
 * @description Esquema de producto
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    costPrice: {  
        type: Number,
        required: true,
        min: [0.01, 'El precio de costo debe ser mayor a 0']
    },
    salePrice: {  
        type: Number,
        required: true,
        min: [0.01, 'El precio de venta debe ser mayor a 0']
    },
    currency: {
        type: String,
        default: 'MXN',
    },
    availability: {
        type: Boolean,
        required: true,
        default: true,
    },
    ingredients: {
        type: [String],
        default: [],
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
},
{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;