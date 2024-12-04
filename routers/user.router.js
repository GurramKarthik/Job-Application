import express from "express"
import { Login, LogOut, Register, updateProfile, viewProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();


// end points of user
router.route("/register").post(Register)
router.route("/login").post((req, res, next) => {
    res.send("Login")
    next();
}, Register);
router.route("/profile/update").put( isAuthenticated, updateProfile)
router.route("/profile/view").get(isAuthenticated, viewProfile)
router.route("/logout").get(isAuthenticated, LogOut)

// api call will be from 
// http://localhost:8000/api/v1/user/register
// http://localhost:8000/api/v1/user/login
// http://localhost:8000/api/v1/user/profile/update
// http://localhost:8000/api/v1/user/profile/view
// http://localhost:8000/api/v1/user/logout

export default router;