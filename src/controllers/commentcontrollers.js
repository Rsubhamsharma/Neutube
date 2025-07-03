import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.models.js";
import {Comment} from '../models/comment.models.js'
import mongoose from "mongoose";


//create comment 
const createComment = asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {content}= req.body
    if(!content){
        throw new ApiError(400,"Enter content for the comment ")
    }
const user= await User.findById(req.user?._id)
if(!user){
    throw new ApiError(404,"User not found")
}
const comment = await Comment.create({
    content:content,
    video:videoId,
    owner:user._id

})
return res.status(200).json(new ApiResponse(200,comment,"Comment created successfully"))
})
//Read comment 
const getcomment = asyncHandler(async(req,res)=>{
    const{videoId}=req.params

    const comments = await Comment.find({video:videoId})
    if(!comments||comments.length===0){
        return res.status(200).json(new ApiResponse(200,{},"No comment available"))
    }
    return res.status(200).json(new ApiResponse(200,comments,"Comments fetched successfully"))

})
//update comment 
const updateComment = asyncHandler(async(req,res)=>{
    const {commentId}= req.params
    const {content}=req.body
    if(!content){
        throw new ApiError(400,"Content is required")
    }
    const comment= await Comment.findByIdAndUpdate(commentId,
        {content:content},
        {new:true})
    if(!comment)
    {
    throw new ApiError(404,"Comment not found")
    }    

return res.status(200).json(new ApiResponse(200,comment,"Comment updated successfully"))

})
//delete comment
const deleteComment=asyncHandler(async(req,res)=>{
    const{commentId}=req.params
    const comment = await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
return res.status(200).json(new ApiResponse(200,comment,"Comment deleted successfully"))

})
export {createComment,getcomment,updateComment,deleteComment}