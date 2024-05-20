const express = require("express")
const { getCategory, getAllCategories, createCategory, deleteCategory, editCategory, addItemToCategory, editItemInCategory, deleteItemInCategory } = require("../controllers/categoryController")

const router = express.Router()
const { protect } = require("../middleware/authMiddleware")

router.use(protect)

router.route("/").get(getAllCategories)

router.route("/:id").get(getCategory)

router.route("/").post(createCategory)

router.route("/:id").put(editCategory)

router.route("/:id").delete(deleteCategory)

router.route("/:id/items").post(addItemToCategory)

router.route("/:categoryId/items/:itemId").put(editItemInCategory)

router.route("/:categoryId/items/:itemId").delete(deleteItemInCategory)


// router.route("/current").get(currentUser)

module.exports = router