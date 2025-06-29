import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.models.js";
import { Tweet } from "../models/tweet.models.js";

//Creating a tweet or controller for posting the tweet

const postTweet = asyncHandler(async(req,res)=>{
    const {description,title} = req.boody
    if(!description||!title){
        throw new ApiError(400,"Title and description is required")
    }
    const user= await  User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404,"User not found ")

    }
    const newtweet = await Tweet.create({
        owner:user._id,
        content:{title,description}
    })
    res.status(200).json(new ApiResponse(200,newtweet,"Tweet posted succesfully"))


})
export {postTweet}