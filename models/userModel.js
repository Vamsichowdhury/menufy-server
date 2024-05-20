const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:[true,"Please add the username"]
    },
    email:{
        type: String,
        required:[true, "Please add the user email address"],
        unique:["email already registered"]
    },
    password:{
        type: String,
        required:[true, "Please enter password"]
    }
},{
    timeStamps:true
})
module.exports = mongoose.model("UserModel", userSchema)