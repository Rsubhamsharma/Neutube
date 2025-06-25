
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/User.models.js'
import { uploadcloudinary } from '../utils/cloudinary.js' 
import {ApiResponse} from '../utils/ApiResponse.js'


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
const avatarpath = req.files?.avatar[0]?.path;


if(!avatarpath){
    throw new ApiError(400,"Avatar is required ")

}
//const coverimagepath = req.files?.coverimage[0]?.path;
  let coverimagepath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimagepath = req.files.coverimage[0].path
    }


console.log(avatarpath);
console.log(coverimagepath);


const avatar = await uploadcloudinary(avatarpath)
const coverimage= await uploadcloudinary(coverimagepath)
console.log(avatar);
console.log(coverimage);


// if(!avatar){
//     throw new ApiError(400,"Avatar required")
// }

const user= await User.create({
    email,
    password,
    username,
    fullName,
    avatar: avatar.url,
    coverimage:coverimage.url
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











export { registerUser,loginuser,logoutuser}