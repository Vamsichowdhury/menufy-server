const mongoose = require('mongoose');
const resizeImage = require("../helpers/resizeImage")
const asyncHandler = require("express-async-handler")
const { itemModel, categoryModel } = require("../models/categoryModel");
const fs = require('fs');
const path = require('path');

/*
    desc    -   get a category
    route   -   GET -   /api/categories/:id
    access  -   public
*/
const getCategory = async (req, res, next) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            res.status(404)
            throw new Error("Contact not found");
        }
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}

/*
    desc    -   get all categories
    route   -   GET -   /api/categories (http://localhost:5001/api/categories)
    access  -   public
*/
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryModel.find()
    if (!categories) {
        res.status(404)
        throw new Error("No categories found")
    }
    res.status(200).json(categories)
})
/*
    desc    -   create category
    route   -   POST -   /api/categories ( http://localhost:5001/api/categories )
    access  -   public
*/
const createCategory = asyncHandler(async (req, res) => {
    try {
        let imageSrc = req.file ? `/uploads/${req.file.filename}` : 'https://cdn.vuetifyjs.com/images/cards/cooking.png';

        // Resize the uploaded image
        if (req.file) {
            const resizedImagePath = `uploads/resized_${req.file.filename}`;
            await resizeImage(req.file.path, resizedImagePath);

            // Delete the original image file
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Error deleting the original image:', error);
            }

            // Update the imageSrc to the resized image path
            imageSrc = `/uploads/resized_${req.file.filename}`;
        }

        req.body.imageSrc = imageSrc;

        const category = await categoryModel.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


/*
    desc    -   edit category
    route   -   PUT -   /api/categories/:id
    access  -   public
*/
const editCategory = asyncHandler(async (req, res) => {
    let updatedCategoryData = req.body;

    // Check if a new file is uploaded
    if (req.file) {
        // Delete previous file if it exists
        const previousCategory = await categoryModel.findById(req.params.id);
        if (previousCategory && previousCategory.imageSrc) {
            const previousImagePath = path.join(__dirname, '..', previousCategory.imageSrc);
            try {
                // Check if the file exists before attempting to delete it
                if (fs.existsSync(previousImagePath)) {
                    fs.unlinkSync(previousImagePath);
                }
            } catch (error) {
                console.error('Error deleting previous image:', error);
            }
        }

        // Resize the uploaded image
        const resizedImagePath = `uploads/resized_${req.file.filename}`;
        await resizeImage(req.file.path, resizedImagePath);

        // Delete the original image file after resizing
        try {
            fs.unlinkSync(req.file.path);
        } catch (error) {
            console.error('Error deleting the original image:', error);
        }

        // Set imageSrc to the path of the resized file
        updatedCategoryData.imageSrc = `/${resizedImagePath}`;
    }

    // Update the category with the new data
    const updatedCategory = await categoryModel.findByIdAndUpdate(
        req.params.id,
        updatedCategoryData,
        { new: true }
    );
    res.status(200).json(updatedCategory);
});


/*
    desc    -   delete category
    route   -   DELETE -   /api/category/:id
    access  -   public
*/
const deleteCategory = asyncHandler(async (req, res) => {
    // Find the category by ID
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found to delete");
    }

    // Delete images associated with each item in the category
    category.totalItems.forEach(item => {
        if (item.imageSrc) {
            const imagePath = path.join(__dirname, '..', item.imageSrc);
            try {
                // Check if the file exists before attempting to delete it
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Deleted item image: ${imagePath}`);
                } else {
                    console.log(`Image file not found: ${imagePath}`);
                }
            } catch (error) {
                console.error('Error deleting item image:', error);
            }
        }
    });

    // Also delete the category image if it exists
    if (category.imageSrc) {
        const categoryImagePath = path.join(__dirname, '..', category.imageSrc);
        try {
            if (fs.existsSync(categoryImagePath)) {
                fs.unlinkSync(categoryImagePath);
                console.log(`Deleted category image: ${categoryImagePath}`);
            } else {
                console.log(`Category image file not found: ${categoryImagePath}`);
            }
        } catch (error) {
            console.error('Error deleting category image:', error);
        }
    }

    // Delete the category
    const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
        res.status(404);
        throw new Error("Category not found to delete");
    }

    res.status(200).json(deletedCategory);
});



/*
    desc    -   add item to category
    route   -   POST -   /api/categories/:categoryId/items ( http://localhost:5001/api/categories/:categoryId/items )
    access  -   public
*/
const addItemToCategory = asyncHandler(async (req, res) => {
    const newItem = req.body;
    const categoryId = req.params.id;

    // Check if the category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    // Handle image upload and resizing
    if (req.file) {
        const resizedImagePath = `uploads/resized_${req.file.filename}`;
        await resizeImage(req.file.path, resizedImagePath);

        // Delete the original image file
        try {
            fs.unlinkSync(req.file.path);
        } catch (error) {
            console.error('Error deleting the original image:', error);
        }

        newItem.imageSrc = `/${resizedImagePath}`;
    }

    // Create a new item instance with the provided data
    const item = new itemModel(newItem);

    // Add the new item to the category's totalItems array
    category.totalItems.push(item);

    // Save the category with the new item added
    await category.save();

    res.status(201).json(category);
});

const editItemInCategory = asyncHandler(async (req, res) => {
    const updatedItem = req.body;
    const categoryId = req.params.categoryId;
    const itemId = req.params.itemId;

    // Check if the category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    // Find the index of the item in the totalItems array
    const index = category.totalItems.findIndex(item => item._id.toString() === itemId);
    if (index === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }

    // Handle image upload and resizing
    if (req.file) {
        // Delete previous file if it exists
        const previousItem = category.totalItems[index];
        if (previousItem && previousItem.imageSrc) {
            const previousImagePath = path.join(__dirname, '..', previousItem.imageSrc);
            try {
                // Check if the file exists before attempting to delete it
                if (fs.existsSync(previousImagePath)) {
                    fs.unlinkSync(previousImagePath);
                }
            } catch (error) {
                console.error('Error deleting previous image:', error);
            }
        }

        // Resize the uploaded image
        const resizedImagePath = `uploads/resized_${req.file.filename}`;
        await resizeImage(req.file.path, resizedImagePath);

        // Delete the original image file after resizing
        try {
            fs.unlinkSync(req.file.path);
        } catch (error) {
            console.error('Error deleting the original image:', error);
        }

        updatedItem.imageSrc = `/${resizedImagePath}`;
    }

    // Update the item at the found index with the new data
    category.totalItems[index] = { ...category.totalItems[index]._doc, ...updatedItem };

    // Save the category with the updated item
    await category.save();

    res.json(category);
});


const deleteItemInCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const itemId = req.params.itemId;

    // Check if the category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    // Find the index of the item in the totalItems array
    const delIndex = category.totalItems.findIndex(item => item._id.toString() === itemId);
    if (delIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }

    // Get the item to be deleted
    const itemToDelete = category.totalItems[delIndex];

    // Delete the image file if it exists
    if (itemToDelete.imageSrc) {
        const imagePath = path.join(__dirname, '..', itemToDelete.imageSrc);
        try {
            // Check if the file exists before attempting to delete it
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        } catch (error) {
            console.error('Error deleting item image:', error);
        }
    }

    // Remove the item from the totalItems array
    category.totalItems.splice(delIndex, 1);

    // Save the category
    await category.save();

    res.json(category);
});


module.exports = { getCategory, getAllCategories, createCategory, deleteCategory, editCategory, addItemToCategory, editItemInCategory, deleteItemInCategory }