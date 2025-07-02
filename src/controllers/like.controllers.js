import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/likes.models.js";
import mongoose from "mongoose";


//toogle like in a video - the logic is when user clicks the like button it call this api and then it checks if 
//already like the it dislikes it else it creates a like 
 const toggleVideoLike= asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {userId}= req.user?._id
    const deleteLike = await Like.findOneAndDelete({video:videoId,likedBy:userId})
    if (deleteLike){
        return res.status(200).json( new ApiResponse(200,{},"Like deleted successfully"))

    }
    const createLike= await Like.create({
        video:videoId,
        likedBy:userId
    })
    if(!createLike){
        return res.status(200).json(new ApiResponse(200,{},"Like created successfully"))
    }
})
//toggle comment  like 
const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId}=req.params
     const {userId} = req.user?._id
    const deleteCommentLike =await Like.findOneAndDelete({comment:commentId,likedBy:userId})
    if(deleteCommentLike){
        return res.status(200).json(new ApiResponse(200,{},"Comment like deleted"))
    }
    const createLike= await Like.create({
        comment:commentId,
        likedBy:userId
    })
    if(createLike){

        return res.status(200).json(new ApiResponse(200,{},"Like created succesfully"))
    }

})
//toggle tweet like
const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
     const {userId} = req.user?._id
    const deleteTweetLike =await Like.findOneAndDelete({tweet:tweetId,likedBy:userId})
    if(deleteTweetLike){
        return res.status(200).json(new ApiResponse(200,{},"Tweet like deleted"))
    }
    const createLike= await Like.create({
        tweet:tweetId,
        likedBy:userId
    })
    if(createLike){

        return res.status(200).json(new ApiResponse(200,{},"Like created succesfully"))
    }

})
const getAllLikedVideos = asyncHandler(async(req,res)=>{
    
    const likedvideos = await Like.aggregate([
        {$match:{likedBy: req.user?._id}},
        {$lookup:{
            from:"videos",
            localField:"video",
            foreignField:"_id",
            as:"likedvideos"
        }},
        {$unwind:"$likedvideos"},
        {$replaceRoot:{newRoot:"$likedvideos"}}

])
if(!likedvideos){
    throw new ApiError(400,"No liked videos")
}
return res.status(200).json(new ApiResponse(200,likedvideos,"Liked videos fetched successfully"))
})

export {toggleVideoLike,toggleCommentLike,toggleTweetLike,getAllLikedVideos}