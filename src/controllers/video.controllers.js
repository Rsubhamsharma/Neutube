import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.models.js";
import { Video } from "../models/Video.models.js";
import {uploadcloudinary} from '../utils/cloudinary.js'

// get all videos 
const getAllVideos = asyncHandler(async(req,res)=>{
    const{page=1,limit=10,query,sortBy,sortType,userId}= req.query
    const filter={}
    if(query){
        filter.$or =[{
            title:{$regex:query,$options:"i"},
            description:{$regex:query,$options:"i"}
        }]
    }
    if(sortBy && sortType){
        filter.sort = {[sortBy]: sortType === "asc" ? 1 : -1}
    } else {
        filter.sort = {createdAt: -1} // default sort by createdAt in descending order
    }
    if(userId){
            filter.owner=new mongoose.Types.ObjectId(userId)
        }
        const videos = await Video.find(filter).populate("thumbnail","duration","videofile","views","isPublished")
        .sort(filter.sort)
        .skip((page -1)*limit)
        .limit(parseInt(limit))
        
        if(videos.length===0){
            throw new ApiError(404,"No videos found")
            
        }
        return res.status(200).json(new ApiResponse(200,videos,"Videos fetched successfully"))

    
})
const getvidosById = asyncHandler(async(req,res)=>{
    const {videoId}= req.params
    const video = Video.aggregate([
        {$match:_id},
        {$lookup:{
            from:"comments",
            let:{ videoId: "$_id" },
            pipeline:[
                {$match:{$expr: {$eq:["$videoId","$$videoId"]}}},
                {$count:"count"}
                ],
                as:"commentStats"
        }},
        {$lookup:{
            from:"likes",
            let:{videoId:"_id"},
            pipeline:[
                {$match:{$expr:{$eq:["$videoId","$$videoId"]}}},
                {$count:"count"}
            ],
            as:"likeStats"
        }},
        //comment count
        {$addFields:{
            commentcount:{$cond:[
                {$gt:[{$size:"$commentStats"},0]},
                {$arrayElemAt:["$commentStats.count",0]},
                0 
            ]},
            //like count 
            likecount:{$cond:[
                {$gt:[{$size:"$likeStats"},0]},
                {$arrayElemAt:["$likeStats.count",0]}
                ,0
            ]}                                                                                                                                                      
        }},
        {$project:{
            _id:1,
            title:1,
            description:1,
            thumbnail:1,
            videofile:1,
            views:1,
            isPublished:1,
            commentcount:1,
            likecount:1
        }}
     ])
     if(!video || video.length ===0){
        throw new ApiError(404,"Video not found")
     }
     return res.status(200).json(new ApiResponse(200,video[0],"Video fetched successfully"))
})
// create videos
const publishVideo=asyncHandler(async(req,res)=>{
  const {title,description}=req.body
  const videofilepath=req.file?.path
  const thumbnailpath=req.file?.path
  if(!videofilepath||!thumbnailpath){
    throw new ApiError(400,"Video File required")
  }

const videofile = uploadcloudinary(videofilepath)
const thumbnail=uploadcloudinary(thumbnailpath)
if(!videofile?.url||!thumbnail?.url){
    throw new ApiError(400,"Error uploading files try again")
}
const video = await Video.create({
    title,
    description,
    videofile,
    thumbnail,
   
    owner:req.user?._id,
    duration:videofile.duration
})
return res.status(200).json(new ApiResponse(200,video,"Video created successfully"))
})
//update video
const updateVideo = asyncHandler(async(req,res)=>{
    const{videoId}=req.params
    const{title,description}=req.body
    if(!title||!description){
        throw new ApiError(400,"Title and description required")
    }
    const video= await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found ")
    }
       
    if(video.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(403,"Unautorized access only owner can update")
    }
    video.title= title
    video.description=description
    await video.save()
    return res.status(200).json(new ApiResponse(200,video,"Video updated successfully"))
})
//delete video
const deleteVideo = asyncHandler(async(req,res)=>{
    const{videoId}=req.params
    const video= await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found ")
    }
       
    if(video.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(403,"Unautorized access only owner can delte")
    }
    await video.deleteOne()
    return res.status(200).json(new ApiResponse(200,video,"Video delete successfully"))

})
// toggle isPublished 
const toggleIsPublished = asyncHandler(async(req,res)=>{
    const{videoId}= req.params
    const toggle = await Video.findByIdAndUpdate(videoId,{isPublished:false})
    if(toggle){
        return res.status(200).json(new ApiResponse(200,{},"isPublished is false"))
    }
    return res.status(200).json(new ApiResponse(200,{},"isPublished is true"))
})
export { getAllVideos,getvidosById,publishVideo,updateVideo,deleteVideo,toggleIsPublished}