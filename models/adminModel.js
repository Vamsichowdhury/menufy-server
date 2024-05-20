const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    adminLevel: {
        type: String,
        required: [true, "Please select admin level"]
    },
    email: {
        type: String,
        required: [true, "Please add the user email address"],
        unique: ["email already registered"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    }
}, {
    timeStamps: true
})
module.exports = mongoose.model("AdminSchema", adminSchema)