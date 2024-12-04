import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { applyJob, getApplcations, getAppliedJobs, updateStatus } from "../controllers/Application.controller.js"

const router = express.Router()

router.route("/apply/:id").post(isAuthenticated, applyJob)// for students ----  needs job id
router.route("/get").get(isAuthenticated, getAppliedJobs) // for students
router.route("/:id/applicants").get(isAuthenticated, getApplcations) // needs JobId ---- for recuters
router.route("/status/:id/update").put(isAuthenticated, updateStatus) //for recuters ---- needs applciation ID



export default router;