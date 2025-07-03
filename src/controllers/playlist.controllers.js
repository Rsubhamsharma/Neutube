import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Playlist} from '../models/playlist.models.js'


//create playlist
 const createPlaylist= asyncHandler(async(req,res)=>{
    const {name,description}= req.body
    if(!name||!description){
        throw new ApiError(400,"Name and description needed")
    }
    
    const playlist = await Playlist.create({
       owner:req.user?._id,
        name,
        description
    })
   
    return  res.status(200).json(new ApiResponse(200,playlist,"Playlist created successfully"))

 })
 // get user playlists - in the playlist there will be videos so all playlists with videos in it
 const getUserPlaylists = asyncHandler(async(req,res)=>{
    const{userId}=req.params
    const playlists = await Playlist.find({owner:userId}).populate("videos")
    if(playlists.length===0){
        return res.status(200).json(new ApiResponse(200,[],"No playlists available "))
    }
    return res.status(200).json(new ApiResponse(200,playlists,"Playlists fetched successfully"))
 })
 //get playlist by Id
 const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId}= req.params
    const playlist = await Playlist.aggregate([
        {$match:{_id:playlistId,owner:req.user?._id}},
        {$lookup:{
            from:"videos",
            localField:"videos",
            foreignField:"_id",
            as:"videos"
        }},
        {$unwind:"$videos"}
])
  if(playlist.length===0){
    return res.status(200).json(new ApiResponse(200,[],"Playlist is empty"))
  }
  return res.status(200).json(new ApiResponse(200,playlist,"Playlist fetched successfully"))
 })
 //add video in playlist
 const addVideoInPlaylist=asyncHandler(async(req,res)=>{
    const {videoId,playlistId}=req.params
    const add = await Playlist.findByIdAndUpdate(playlistId,{$addToSet:{videos:videoId}},{new:true}).populate("videos","videofile","thumbnail","title","duration","owner")
    if(!add){
        throw new ApiError(500,"Something went wrong try again!")
    }
    return res.status(200).json(new ApiResponse(200,add,"Video added successfully"))
 })
 export {createPlaylist,getUserPlaylists,getPlaylistById,addVideoInPlaylist}