const express = require("express")
const { getCategory, getAllCategories, createCategory, deleteCategory, editCategory, addItemToCategory, editItemInCategory, deleteItemInCategory } = require("../controllers/categoryController")

const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { upload } = require("../middleware/uploadMiddleware")

router.use(protect)

router.route("/").get(getAllCategories)

router.route("/:id").get(getCategory)

// Create category route with image upload
router.post("/", upload.single('image'), createCategory);

// Edit category route with image upload
router.put("/:id", upload.single('image'), editCategory);

router.route("/:id").delete(deleteCategory)

// Create category route with image upload
router.post("/:id/items", upload.single('image'), addItemToCategory);

// Edit category route with image upload
router.put("/:categoryId/items/:itemId", upload.single('image'), editItemInCategory);

router.route("/:categoryId/items/:itemId").delete(deleteItemInCategory)


// router.route("/current").get(currentUser)

module.exports = router