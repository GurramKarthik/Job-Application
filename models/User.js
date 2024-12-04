import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName :{
        type:String, 
        required: true,
        minLength:[2, "User Name should be atleast 2 chars"]
    },
    email :{
        type:String, 
        required: true,
        unique:[true, "email already Exists"],
        minLength:[2, "Enter Correct Email"]
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String, 
        required: true,
        minLength:[8, "Password should be atleast 8 characters including Special Charecters and Numbers"]
    },
    role:{
        type:String,
        enum:["Recruter", "Candidate"],
        required:true,
    }, 
    profile:{
        bio : {type:String},
        skills: [{type:String}],
        company :{type:mongoose.Schema.Types.ObjectId, ref:'Company'}
    }

}, {timestamps:true})

export const User = mongoose.model("User", userSchema);