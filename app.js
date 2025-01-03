import express, { urlencoded } from "express";
import cookie from "cookie-parser";  // Used to parse the cookie in the server
import dotenv from "dotenv"; // used to get enironment variables from .env file.
dotenv.config({});
import mongoDb from "./utils/db.js";
import userRouter from "./routers/user.router.js";
import companyRouter from "./routers/company.router.js";
import jobRouter from "./routers/job.router.js";
import applicationRouter from "./routers/application.router.js"
import cookieParser from "cookie-parser";




const app = express();


const port =  process.env.PORT || 3000; 
// if port is not avilable in .env then 3000 is port number

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

app.use(cookieParser());



//creating api's for user
app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRouter)
app.use("/api/v1/user/job", jobRouter )
app.use("/api/v1/user/application", applicationRouter)


app.listen(port, ()=>{
    console.log(`listening to port ${port}....`);
    mongoDb();
})
