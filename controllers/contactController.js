const asyncHandler = require("express-async-handler")
const contactModel = require("../models/contactModel")
/*
    desc    -   get all contacts
    route   -   GET -   /api/contacts (http://localhost:5001/api/contacts)
    access  -   public
*/
const getAllContacts = asyncHandler(async (req, res) => {
    console.log("test")
    const contacts = await contactModel.find()
    if (!contacts) {
        res.status(404)
        throw new Error("No contacts found")
    }
    res.status(200).json(contacts)
})

/*
    desc    -   get a contact
    route   -   GET -   /api/contacts/:id
    access  -   public
*/
const getContact = async (req, res, next) => {
    try {
        const contact = await contactModel.findById(req.params.id);
        if (!contact) {
            console.log("vamsi in",{contact})
            res.status(404)
            throw new Error("Contact not found");
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
}


/*
    desc    -   create contact
    route   -   POST -   /api/contacts
    access  -   public
*/
const createContact = asyncHandler(async (req, res) => {
    const { name, phNo, email } = req.body
    if (!req.body.name || !req.body.phNo || !req.body.email) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    console.log(name, phNo, email)
    const contact = await contactModel.create({
        name, phNo, email
    })
    res.status(201).json(contact)
})

/*
    desc    -   update contact
    route   -   PUT -   /api/contacts/:id
    access  -   public
*/
const updateContact = asyncHandler(async (req, res) => {
    const contact = contactModel.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact not found")
    }
    const updatedContact = await contactModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(200).json(updatedContact)
})

/*
    desc    -   delete contact
    route   -   DELETE -   /api/contacts/:id
    access  -   public
*/
const deleteContact = asyncHandler(async (req, res) => {
    const deletedContact = await contactModel.findByIdAndDelete(req.params.id)
    if (!deletedContact) {
        res.status(404)
        throw new Error("Contact not found to delete")
    }
    res.status(200).json(deletedContact)
})

module.exports = { getAllContacts, getContact, createContact, updateContact, deleteContact }