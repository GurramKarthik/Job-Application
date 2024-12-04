import mongoose, { model } from "mongoose";

async function mongoDb() {
    try{
    await mongoose.connect(process.env.MONGO_URL)
        console.log("mongoDB is connected successfully");
    }catch(err){
        console.log("error in connecting mongo DB", err);
    }
}


export default mongoDb;
