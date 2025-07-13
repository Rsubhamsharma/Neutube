import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Subcription} from '../models/subscription.models.js'
import { User } from "../models/User.models.js";


//create subscriber
const toggleSubscriber= asyncHandler(async(req,res)=>{
    const{channelId}=req.params
    const unsubscribe= await Subcription.findOneAndDelete({subscriber:req.user?._id,channel:channelId})
    if(unsubscribe){
        return res.status(200).json(new ApiResponse(200,{},"Channel unsubscribed succssfully"))
    }
    const subscribe=await Subcription.create({
        subscriber:req.user?._id,
        channel:channelId,
        isSubscribed:true
    })
    return res.status(200).json(new ApiResponse(200,subscribe,"Subscribed successfully"))

})
//get channel subscribers
const getChannelSubscriber = asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    const getsubscribers = await Subcription.aggregate([
        {$match:{channel:channelId}},
        {$lookup:{
            from:"users",
            localField:"subscriber",
            foreignField:"_id",
            as:"subscribers"
        }},
        {$unwind:"$subscribers"},
        {$group:{
            _id:"$channel",
            subscribers:{$push:"$subscribers"},
            subscribercount:{$sum:1}
        }},

        {$project:{
            _id:0,
            subscribers:1,
            subscribercount:1
            
        }
        }

    ])
    if(!getsubscribers.length){
        return res.status(200).json(new ApiResponse(200,{subscribercount:0,subscribers:[]},`No subscribers found for channel `))
    }
    return res.status(200).json(new ApiResponse(200,getsubscribers[0],"Channel subscribers fetched successfully"))

})
// get chanels subscribed 
const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params
    const getchannels = await Subcription.aggregate([
        {$match:{subscriber:subscriberId}},
        {$lookup:{
            from:"users",
            localField:"channel",
            foreignField:"_id",
            as:"subscribedchannels"
        }},
        {$unwind:"$subscribedchannels"},
        {$group:{
            _id:"$subscriber",
            subscribedchannels:{$push:"$subscribedchannels"},
            subscribedtocount:{$sum:1}
        }},
        {$project:{
            _id:0,
            subscribedtocount:1,
            subscribedchannels:1
        }}

    ])
    if(!getchannels.length){
        return res.status(200).json(new ApiResponse(200,{subscribedto:[]},"No subscribed channels"))
    }
    return res.status(200).json(new ApiResponse(200,getchannels[0],"Subscribed channels fetched successfully"))
})
export {toggleSubscriber,getChannelSubscriber,getSubscribedChannels}