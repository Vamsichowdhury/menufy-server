const asyncHandler = require("express-async-handler")
const adminModel = require("../models/adminModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

/*
    desc    -   Register admin
    route   -   POST -   /api/register
    access  -   public
*/
const registerAdmin = asyncHandler(async (req, res) => {
    const { adminLevel, email, password } = req.body

    if (!adminLevel || !email || !password) {
        res.status(400)
        throw new Error("All the fields are mandatory")
    }

    const adminAvailable = await adminModel.findOne({ email })
    if (adminAvailable) {
        res.status(400)
        throw new Error("Admin already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const createdAdmin = await adminModel.create({
        adminLevel,
        email,
        password: hashedPassword
    })

    if (createdAdmin) {
        res.status(201).json({ _id: createdAdmin._id, adminLevel: createdAdmin.adminLevel, email: createdAdmin.email })
    } else {
        res.status(400)
        throw new Error("Admin data is invalid")
    }
})


/*
    desc    -   Login admin
    route   -   POST -   /api/login
    access  -   public
*/
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    const admin = await adminModel.findOne({ email })
    if (!admin) {
        res.status(400)
        throw new Error("Invalid email or password")
    }

    const passwordIsValid = await bcrypt.compare(password, admin.password)
    if (!passwordIsValid) {
        res.status(400)
        throw new Error("Invalid email or password")
    }

    // Generate JWT token
    const token = jwt.sign(
        { adminId: admin._id, adminLevel: admin.adminLevel, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.status(200).json({
        _id: admin._id,
        adminLevel: admin.adminLevel,
        email: admin.email,
        token: token
    })
})
const userVerification = asyncHandler(async (req, res) => {
    // User details available in req.user from middleware
    res.json(req.user);
});


module.exports = { registerAdmin, loginAdmin, userVerification }