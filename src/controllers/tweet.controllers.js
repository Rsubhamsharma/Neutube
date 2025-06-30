import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.models.js";
import { Tweet} from "../models/tweet.models.js";



//Creating a tweet or controller for posting the tweet

const postTweet = asyncHandler(async(req,res)=>{
    const {description,title} = req.body
    
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
     return res.status(200).json(new ApiResponse(200,newtweet,"Tweet posted succesfully"))
})

//Read Tweet
const getTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    const tweet = await Tweet.findById(tweetId)
    if (!tweet){
        throw new ApiError(404,"Tweet not found")
    }
    return res.status(200).json(new ApiResponse(200,tweet,"Tweet fetched successfully"))
})
// Read all  tweets
const  getallTweets = asyncHandler(async(req,res)=>{
    const {userId}= req.params
    
    const tweets = await Tweet.find({owner:userId}).sort({createdAt:-1})
    return res.status(200).json(new ApiResponse(200,tweets,"All tweets fetched successfully"))
})
//update tweet
const updateTweet = asyncHandler(async(req,res)=>{
    const {title,description}= req.body
   const {tweetId} = req.params


    const tweet =await Tweet.findByIdAndUpdate(tweetId,
        {
            content :{title,description}
        },
        {new:true}
    )
    if (!tweet){
        throw new ApiError(404,"tweet not found")
    }
    return res.status(200).json(new ApiResponse(200,tweet,"Tweet updated successfully"))

})
//Delete Tweet
const deleteTweet = asyncHandler(async(req,res)=>{
     const {tweetId} = req.params

    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError(404,"Tweet not found or deleted")
    }
    return res.status(200).json(new ApiResponse(200,tweet,"Tweet deleted successfully"))


    })
export {postTweet,getTweet,updateTweet,deleteTweet,getallTweets}