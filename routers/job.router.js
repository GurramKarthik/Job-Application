import express from "express";
import { getJobById, getJobByRecruter, getJobs, postJob } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/post").post( isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getJobs);
router.route("/get/:jobId").get(isAuthenticated, getJobById);
router.route("/getAdminJobs").get(isAuthenticated, getJobByRecruter);

export default router;