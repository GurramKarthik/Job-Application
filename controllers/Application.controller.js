import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";


const checkUser = async (userId) => {
    // getting the userId form Token .
    if (!userId) {
      return false;
    }
  
    // getting the user to check weather he is recruter or not.
    const user = await User.findById(userId);
    if (!user || user.role !== "Recruter") {
      return false;
    }
  
    return true;
};


export const applyJob = async (req, res)=>{
    try {
        
        const userId = req.userId;
        const {id:jobId }= req.params


        if(!userId){
            return res.status(401).json({
              message: "Please Login before applying for a Job",
              success: false,
            });            
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
              message: "User not Found ",
              success: false,
            });
        }

        if (user.role !== "Candidate") {
            return res.status(401).json({
              message: "User not Autherised to peform this operation",
              success: false,
            });
        }

        const job = await Job.findById(jobId)

        if(!job){
            return res.status(404).json({
                message:"Sorry!. We couldn't find the job you are looking for.",
                success:false
            })
        }
        const ExistingApplicant = await Application.findOne({ 
            $and : [
                {job : jobId}, 
                {applicant : userId}
            ]
        })
        

        if(ExistingApplicant ){
            return res.status(400).json({
                message:"Application already exsits",
                success:false
            })
        }


        const newApplication = await Application.create({
            job : jobId, 
            applicant : userId
        })

        job.application.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message:"Your applicaiton has sent. Prepare well while we process your application",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

// for candiatedates to get jobs they applied.
export const getAppliedJobs = async (req, res)=>{
    try {
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({
              message: "Please Login to view applications",
              success: false,
            });            
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
              message: "User not Found ",
              success: false,
            });
        }

        if (user.role !== "Candidate") {
            return res.status(401).json({
              message: "User not Autherised to peform this operation",
              success: false,
            });
        }


        const applications = await Application.find({applicant: userId}).populate({
            path:"job",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}}
            }
        });

        if(!applications){
           return res.status(404).json({
                message:"Application not found",
                success:false
            })
        }

        return res.status(200).json({
            message:"Applications found",
            applications,
            success:true
        })

    } catch (error) {
        console.log(error)
    }
}

// for recruter to check applciation per job.
export const getApplcations = async (req, res)=>{
    try {

        const {id:jobId }= req.params
        // checking is user is recruter or not

        const user = await checkUser(req.userId);
        if(!user){
            return res.status(401).json({
                message: "User not Autherised.........",
                success: false,
            });
        }
    

        const job = await Job.findById(jobId).populate({
            path:"application",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant"
            }
        })


        if(!job){
            return res.status(404).json({
                 message:"jobs not found",
                 success:false
             })
         }
 
         return res.status(200).json({
             message:"Applications found",
             job,
             success:true
         })
 
    } catch (error) {
        console.log(error)
    }
}

// recruter Updating the status of the application
export const updateStatus = async (req, res)=>{
    try {
        const {status} = req.body
        const {id:applicaitonId }= req.params

        
        // checking is user is recruter or not
        const user = await checkUser(req.userId);
        if(!user){
            return res.status(401).json({
                message: "User not Autherised.........",
                success: false,
            });
        }
    

        if(!status){
            return res.status(400).json({
                message:"status is required to update",
                success:false
            })
        }

        const application = await Application.findById(applicaitonId);
        if(!application){
            return res.status(404).json({
                message:"Application not found",
                success:false
            })
        }
        
        if(status.toLowerCase() === "accepted" || status.toLowerCase() === "rejected"){
            application.status = status.toLowerCase()
            await application.save();                
        }else{
            return res.status(400).json({
                message:"Status can be Accepted or Rejected",
                success:false
            })
        }
        
        return res.status(200).json({
            message:"Application's status updated. ",
            success:true
        })



    } catch (error) {
           console.log(error)
    }
}





