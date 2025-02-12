const Category = require('./categoryModel');

const createCategory = async (categoryData) => {
    return await Category.create(categoryData);
};

const getCategoriesByRestaurant = async (restaurantId) => {
    return await Category.find({ restaurantId }).sort({ createdAt: -1 });
};

const getCategoryById = async (id, restaurantId) => {
    return await Category.findOne({ _id: id, restaurantId });
};

const updateCategory = async (id, categoryData) => {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
};

const deactivateCategory = async (id) => {
    return await Category.findByIdAndUpdate(
        id, 
        { isActive: false }, 
        { new: true }
    );
};

module.exports = {
    createCategory,
    getCategoriesByRestaurant,
    getCategoryById,
    updateCategory,
    deactivateCategory
}; 