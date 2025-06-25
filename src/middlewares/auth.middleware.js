import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken";
export const verifyjwt = asyncHandler(async(req,_,next)=>{
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