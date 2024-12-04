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
import cors from "cors";
import { Login, LogOut, Register, updateProfile, viewProfile } from "./controllers/user.controller.js";
import isAuthenticated from "./middlewares/isAuthenticated.js";
import { getJobById, getJobByRecruter, getJobs, postJob } from "./controllers/job.controller.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "./controllers/company.controller.js";
import { applyJob, getApplcations, getAppliedJobs, updateStatus } from "./controllers/Application.controller.js"



const app = express();


const port =  process.env.PORT || 3000; 
// if port is not avilable in .env then 3000 is port number

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());

const corsOptions ={
    origin:"https://job-application-production.up.railway.app",
    credentials: true,                
} 
app.use(cors(corsOptions));
app.use(cookieParser());


app.use(cookieParser());





//creating api's for user
app.use("/api/v1/user/login",Login)
app.post("/api/v1/user/register", Register);
app.put("/api/v1/user/profile/update", isAuthenticated, updateProfile);
app.get("/api/v1/user/profile/view", isAuthenticated, viewProfile);
app.get("/api/v1/user/logout", isAuthenticated, LogOut);
app.post("/api/v1/job/post", isAuthenticated, postJob);
app.get("/api/v1/job/get", isAuthenticated, getJobs);
app.get("/api/v1/job/get/:jobId", isAuthenticated, getJobById);
app.get("/api/v1/job/getAdminJobs", isAuthenticated, getJobByRecruter);
app.post("/api/v1/company/register", isAuthenticated, registerCompany);
app.get("/api/v1/company/get", isAuthenticated, getCompany);
app.get("/api/v1/company/get/:companyId", isAuthenticated, getCompanyById);
app.put("/api/v1/company/update/:companyId", isAuthenticated, updateCompany);
app.post("/api/v1/job/apply/:id", isAuthenticated, applyJob); // for students - needs job id
app.get("/api/v1/job/getAppliedJobs", isAuthenticated, getAppliedJobs); // for students
app.get("/api/v1/job/:id/applicants", isAuthenticated, getApplcations); // needs JobId - for recruiters
app.put("/api/v1/job/status/:id/update", isAuthenticated, updateStatus); // for recruiters - needs application ID


app.listen(port, ()=>{
    console.log(`listening to port ${port}....`);
    mongoDb();
})
