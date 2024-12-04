import { Company } from "../models/Company.js";
import { User } from "../models/User.js";


const checkUser = async (userId) => {
  // getting the userId form Token .
  if (!userId) {
    return null;
  }

  // getting the user to check weather he is recruter or not.
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  return user;
};

export const registerCompany = async (req, res) => {
  try {
    const { name:companayName } = req.body;
    if (!companayName) {
      return res.status(400).json({
        message: "company is required",
        success: false,
      });
    }

    // checking if company alrady exsists or not
    let companyExists = await Company.findOne({ name: companayName });
    if (companyExists) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

   
    const user = await checkUser(req.userId);


    if(!user){
        return res.status(401).json({
            message: "User not Autherised.........",
            success: false,
        });
    }

               
    if (user.role !== "Recruter") {
      return res.status(401).json({
        message: "Your are not autherised to create a company",
        success: false,
      });
    }

    const newCompany = await Company.create({
      name: companayName,
      userId: user._id,
    });

    return res.status(201).json({
      message: "You have successfully registered a company",
      newCompany,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userid = req.userId
    console.log("Companies  " , userid );

    const user = await checkUser(userid);
    if (!user) {
      return res.status(401).json({
        message: "User not Autherised",
        success: false,
      });
    }

    const companies = await Company.find({ userId: user._id });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Companies retrived successfully",
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyById = async (req, res) => {
    


  try {
    const { companyId } = req.params;
    if(!companyId){
      console.log(" comsjs: ",companyId)
        return;
    }else{
      
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company retrived successfully",
      company,
      success: true,
    });
  }
  } catch (error) {
    console.log(error);
  }

};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const { companyId } = req.params;

    

    const updatedData = { name, description, website, location };

    const user = await checkUser(req.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not Autherised..........",
        success: false,
      });
    }

    const company = await Company.findByIdAndUpdate(companyId, updatedData, {
      runValidators: true,
      new: true,
    }).catch((err)=>{
      return res.status(400).json({
        message: err.errorResponse.codeName,
        success: false,
      });

    })
    ;

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company Details Updated Successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


