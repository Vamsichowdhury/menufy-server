const express = require("express")
const { loginAdmin, registerAdmin, userVerification, getAllAdmins, deleteAdmin, editAdmin } = require("../controllers/adminController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()
const { verifyToken } = require("../middleware/verifyAdminUserToken")

router.post("/login", loginAdmin);
router.post("/user", verifyToken, userVerification);

router.use(protect)

router.post("/adminDashboard/register", registerAdmin);
router.post("/adminDashboard/allAdmins", getAllAdmins);
router.delete("/adminDashboard/deleteAdmin/:id", deleteAdmin);
router.put("/adminDashboard/editAdmin/:id", editAdmin);

module.exports = router