const express = require("express")
const { loginAdmin, registerAdmin, userVerification } = require("../controllers/adminController")

const router = express.Router()
const { verifyToken } = require("../middleware/verifyAdminUserToken")

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/user", verifyToken, userVerification);


module.exports = router