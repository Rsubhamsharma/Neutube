
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/User.models.js'
import { uploadcloudinary } from '../utils/cloudinary.js' 
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import { use } from 'react'
import { application } from 'express'
import mongoose from 'mongoose'


const generateaccessandrefreshtoken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accesstoken = generateAccessToken()
        const refreshtoken = generateRefreshToken()
        user.refreshtoken = refreshtoken
        user.save({validateBeforeSave:false})
            return {accesstoken,refreshtoken}
        
        
    }
    
     catch (error) {
        throw new ApiError(500,"Something went wrong")
        
    }}

//get the input from the user 
// validate the inputs checking whether the fields are not empty
//upload the avatar in using multer
//from multer we will upload it in the cloudinary
//check if the user is already registered or not
// create a user object - put  in the db and check 
// remove thr password and token field
//return the object as the response 



const registerUser = asyncHandler(async(req,res)=>{
   
 const {email,password,fullName,username}=req.body
 if([email,password,fullName,username].some((field)=>field?.trim()==="")){
    throw new ApiError(400,"All fields are required")
}
const existeduser = await User.findOne({
    $or:[{email},{username}]
})
if(existeduser){
    throw new ApiError(409,"User with email already exists")
}
 const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadcloudinary(avatarLocalPath)
    const coverImage = await uploadcloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

const createduser= await User.findById(user._id).select("-password -refreshtoken")


if(!createduser){
    throw new ApiError(502,"somehing went wrong")
}
res.status(200).json(
    new ApiResponse(200,createduser,"user registered successfully")
)
    

}
)

const loginuser = asyncHandler(async(req,res)=>{
    // get user details from body
    //username and email
    //find the user 
    //password check
    //generate access and refresh token 
    // send them in cookies
    const {username,email,password} = req.body
    if (!username && !email){
        throw new ApiError(400,"username and email required")
    }
     const user= await User.findOne({
        $or : [{username},{email}]
    })
    if(!user){
        throw new ApiError(401,"No user found ")

    }
    const ispasswordvalid =  isPasswordCorrect(password)
    if(!ispasswordvalid){
        throw new ApiError(401,"Password is wrong ")

    }
const {accesstoken,refreshtoken}= generateaccessandrefreshtoken(user._id)
const loggedinuser = await User.findById(user._id).select("-password -refreshtoken")

const options = {
    httpOnly:true,
    secure:true 
}
 return res.status(200).cookie("accesstoken",accesstoken,options)
.cookie("refreshtoken",refreshtoken,options)
.json(new ApiResponse(
    200,
    {
        user:loggedinuser,accesstoken,refreshtoken

    },
    "User logged in succesfully"

)
)



})
const logoutuser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $unset: {refreshtoken:1}    
    },{new:true})
     const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(
        new ApiResponse(200,{},"user logged out successfully")

    )



})
const refreshaccesstoken = asyncHandler(async(req,res)=>{
    const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken
    if(!incomingrefreshtoken){
        throw new ApiError(401,"Invalid access")
    }
    const decodedtoken= jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedtoken?._id)
    if(!user){
        throw new ApiError(401,"Invalid access")
    }
    if(incomingrefreshtoken != user?.refreshtoken){
        throw new ApiError( 401,"Invalid token")
    }
    const {accesstoken,newrefreshtoken}=generateaccessandrefreshtoken(user._id)
    const options ={
        httpOnly:true,
        secure:true
    }
    res.status(200).cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",newrefreshtoken,options)
    .json(new ApiResponse(200,


    {
        user:accesstoken.refreshtoken
    },"Access and refresh token refreshed"
    ))

})
// Read operation
const getuser = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"user details fetched successfully"))
})
const changepassword = asyncHandler(async(req,res)=>{
    const {oldpassword,newpassword}= req.body
    if(!oldpassword || !newpassword){
        throw new ApiError(404,"Password files are required")
    }
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)
    if(!isPasswordCorrect){
       throw  new ApiError(400,"Wrong password")
    }
     user.password = newpassword
     await user.save({validateBeforeSave:false})
     return res.status(200)
     .json(new ApiResponse(200,{},"Password changed successfully"))
     
     
    })
//update operations
const updateaccountdetails= asyncHandler(async(req,res)=>{
    const{fullName,email}=req.body
    if(!(fullName&&email)){
        throw new ApiError(401,"Fields are missing")
    }
    
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const user = await User.findByIdAndUpdate(req.user._id,{
        $set:{fullName,
            email
        }
    },{new:true}).select("-password")
    return res.status(200).json(new ApiResponse(200,user,"Account details updated"))
})

const updateavatar = asyncHandler((req,res)=>{
   const  avatarpath = req.file?.path
    if(!avatarpath){
        throw new ApiError(401,"Avatar is required")
    }
    const avatar = uploadcloudinary(avatarpath)
    if(!avatar.url){
        throw new ApiError(400,"Error uploading file on cloudinary")
    }
    const user = User.findByIdAndUpdate(req.user._id,{
        $set:{avatar:avatar.url}
    },{new:true}).select("-password -refreshtoken")
    res.status(200).json(new ApiResponse(200,user,"Avatar updated successfully"))

})
const updatecoverimage = asyncHandler((req,res)=>{
   const  coverimagepath = req.file?.path
    if(!coverimagepath){
        throw new ApiError(401,"Cover image is required")
    }
    const coverimage = uploadcloudinary(coverimagepath)
    if(!coverimage.url){
        throw new ApiError(400,"Error uploading file on cloudinary")
    }
    const user = User.findByIdAndUpdate(req.user._id,{
        $set:{coverimage:coverimage.url}
    },{new:true}).select("-password -refreshtoken")
    res.status(200).json(new ApiResponse(200,user,"Coverimage updated successfully"))

})
const getuserprofile = asyncHandler(async(req,res)=>{
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"Username is required")
    }
    const user = await User.aggregate([
        {$match:{usernameL:username.toLowerCase()}},
        {$lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"}},
            {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }},
        {
            $addFields:{
                subscriberCount:{$size:"$subscribers"},
                subscribedToCount:{$size:"$subscriberTo"},
                issubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
            },
            {
                $project:{
                    fullName:1,
                    username:1,
                    avatar:1,
                    coverimage:1,
                    subscriberCount:1,
                    subscribedToCount:1,
                    issubscribed:1,
                    email:1

                }
            }
        ])
        if(!user){
            throw new ApiError(400,"User missing")
        }
    return res.status(200).
    json(new ApiResponse(200,user[0],"User profile fetched successfully"))
})
const gethistory= asyncHandler(async(req,res)=>{
  const user = await User.aggregate([
    {$match:{_id: new mongoose.Types.ObjectId(req.user._id) }},
    
       { $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchHistory",
            pipeline:[{
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",
                    pipeline:[{
                        $project:{
                            fullName:1,
                            username:1,
                            avatar:1
                        }
                    }]
                }


            }]
        }
    },
  {
  $addFields:{owner:{
    $first:"$owner"
}
  }
}])
 if(!user){
            throw new ApiError(400,"User missing")
        }
    return res.status(200).
    json(new ApiResponse(200,user[0],"User watch history fetched successfully"))
})









export { registerUser,loginuser,logoutuser,refreshaccesstoken
    ,changepassword,getuser,updateaccountdetails,
    updateavatar,updatecoverimage,getuserprofile,
    gethistory

}