import { Job } from "../models/Job.js";
import { User } from "../models/User.js";

const checkUser = async (userId) => {
  // getting the userId form Token .
  if (!userId) {
    return null;
  }

  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  return user;
};

// only for recuter
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      companyId,
    } = req.body;
    
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experienceLevel ||
      !location ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }


    const user = await checkUser(req.userId);
    if (!user) {
      return res.status(401).json({
        message: "User is not autherised",
        success: false,
      });
    }

    if (user.role.toLowerCase() !== "recruter") {
      return res.status(401).json({
        message: "User is not autherised to perfome this operation",
        success: false,
      });
    }

    const jobDetails = {
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      experienceLevel,
      location,
      jobType,
      position,
      company: companyId,
      created_by: user._id,
    };

    const newJob = await Job.create(jobDetails);

    return res.status(201).json({
      message: "New job Created successfully",
      newJob,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error while creating a Job",
      success: false,
    });
  }
};

// for candidate
export const getJobs = async (req, res) => {
  try {
    const user = await checkUser(req.userId);
    if (!user) {
      return res.status(401).json({
        message: "User is not autherised",
        success: false,
      });
    }

    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query).populate({
        path:"company"
    }).sort({createdAt:-1}); 

    
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Jobs found",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// for candidate
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate({
      path:"application"
    }).sort({createdAt:-1});
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job found",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// only for recuter
export const getJobByRecruter = async (req, res) => {
  try {
    const user = await checkUser(req.userId);
    if (!user) {
      return res.status(401).json({
        message: "User is not autherised",
        success: false,
      });
    }

    
    if (user.role !== "Recruter") {
      return res.status(401).json({
        message: "User is not autherised to perfom this operation",
        success: false,
      });
    }

    const adminJobs = await Job.find({created_by:user._id}).populate({
      path:"company"
    });
    if(!adminJobs){
        res.status(404).json({
            message: "Jobs not found",
            success: false,
        })
    }

    return res.status(200).json({
        message: "Jobs found",
        adminJobs,
        success: true,
      });

  } catch (error) {
    console.log(error);
  }
};
