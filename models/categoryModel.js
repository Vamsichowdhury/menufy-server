const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    loading: {
        type: Boolean,
        default: false
    },
    imageSrc: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true
    }
});


const categorySchema = new mongoose.Schema({
    loading: {
        type: Boolean,
        default: false
    },
    imageSrc: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {  
        type: String,
        required: true
    },
    totalItems: {
        type: Array,
        default: []
    }
});

// const category = mongoose.model('categorySchema', categorySchema);
// const Item = mongoose.model('Item', itemSchema);

// module.exports = category;
module.exports = {
    itemModel: mongoose.model('Item', itemSchema),
    categoryModel: mongoose.model('categorySchema', categorySchema)
};