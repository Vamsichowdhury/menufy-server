const mongoose = require("mongoose")

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name']
    },
    phNo: {
        type: String,
        required: [true, 'Please add the contact number']
    },
    email: {
        type: String,
        required: [true, 'Please add email']
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("contact", contactSchema)