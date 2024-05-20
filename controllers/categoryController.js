const mongoose = require('mongoose');

const asyncHandler = require("express-async-handler")
const { itemModel, categoryModel } = require("../models/categoryModel");

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
    const category = await categoryModel.create(req.body)
    res.status(201).json(category)
})

/*
    desc    -   edit category
    route   -   PUT -   /api/categories/:id
    access  -   public
*/
const editCategory = asyncHandler(async (req, res) => {
    const category = categoryModel.findById(req.params.id)
    if (!category) {
        res.status(404)
        throw new Error("Category not found")
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(200).json(updatedCategory)
})

/*
    desc    -   delete category
    route   -   DELETE -   /api/category/:id
    access  -   public
*/
const deleteCategory = asyncHandler(async (req, res) => {
    const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id)
    if (!deletedCategory) {
        res.status(404)
        throw new Error("Category not found to delete")
    }
    res.status(200).json(deletedCategory)
})

/*
    desc    -   add item to category
    route   -   POST -   /api/categories/:categoryId/items ( http://localhost:5001/api/categories/:categoryId/items )
    access  -   public
*/
const addItemToCategory = asyncHandler(async (req, res) => {
    const newItem = req.body
    const categoryId = req.params.id;

    // Check if the category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
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

    // Update the item at the found index with the new data
    category.totalItems[index] = { ...updatedItem };

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


    category.totalItems = category.totalItems.filter((item, index) => index !== delIndex)

    // Save the category
    await category.save();

    res.json(category);
});

module.exports = { getCategory, getAllCategories, createCategory, deleteCategory, editCategory, addItemToCategory, editItemInCategory, deleteItemInCategory }