import jwt from "jsonwebtoken"

const isAuthenticated = async (req, res, next) =>{
    try {
        const token = req.cookies.token;
      
        // token not present means un-autherised access is being done
        if(!token){
            return res.status(401).json({
                 message: "token is missing",
                success: false,
              });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            res.status(401).jons({
                message:"Invalid token",
                success:false
            })
        }

        //decode contains token data.
        req.userId = decode.userId
        next()
    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;