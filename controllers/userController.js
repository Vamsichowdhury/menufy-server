const asyncHandler = require("express-async-handler")
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")

/*
    desc    -   Register user
    route   -   POST -   /api/users/register
    access  -   public
*/
const registerUser = asyncHandler(async (req,res)=>{
    const {userName, email, password} = req.body
    if(!userName || !email || !password){
        res.status(400)
        throw new Error("All the fields are mandatory")
    }
    const userAvailable = await userModel.findOne({email})
    if(userAvailable){
        res.status(400)
        throw new Error("User already exists")
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const createdUser = await userModel.create({
        userName,
        email,
        password:hashedPassword
    })
    console.log(createdUser)
    if(createdUser){
        res.status(201).json({_id:createdUser._id,userName:createdUser.userName, email:createdUser.email})
    }else{
        res.status(400)
        throw new Error("User data is invalid")
    }
    res.status(201).json({message:"User Registered"})
})

/*
    desc    -   Login user
    route   -   POST -   /api/users/login
    access  -   public
*/
const loginUser = asyncHandler((req,res)=>{
    console.log(req.body)
    res.status(201).json({message:"loggin user"})
})

/*
    desc    -   Current user
    route   -   GET -   /api/users/current
    access  -   private
*/
const currentUser = asyncHandler((req,res)=>{
    console.log(req.body)
    res.status(201).json({message:"Current user information"})
})

module.exports = {registerUser, loginUser, currentUser}