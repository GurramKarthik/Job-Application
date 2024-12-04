import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    name : {
        type:String, 
        required:true, 
        minLength: [2, "Company Name should be alteast 2 characters"],
        unique:true
    }, 
    description:{
        type:String, 
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    logo:{
        type:String, // url to compnay logo
    },
    userId:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    appliactions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application",
    }]
}, {timestamps:true})

export const Company = mongoose.model("Company", companySchema)