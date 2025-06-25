import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User.models";
import jwt from "jsonwebtoken";
export const verifyjwt = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
    try {
        if(!token){
            throw new ApiError(401,"Unauthorized access")
        }
        const verifytoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user= await User.findById(verifytoken?._id).select("-password -refreshtoken")
        if(!user){
            throw new ApiError(401,"Unauthorized access")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(502,error)
        
    }


})