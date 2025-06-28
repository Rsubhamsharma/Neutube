import { Router } from "express";
import {changepassword, gethistory, getuser,
     getuserprofile, loginuser, logoutuser, 
     refreshaccesstoken, registerUser, updateaccountdetails, 
     updateavatar, updatecoverimage} from '../controllers/User.controllers.js'


import { upload } from '../middlewares/multer.middleware.js'
import { verifyjwt } from "../middlewares/auth.middleware.js";

const  router=Router()
router.route("/register").post(
    upload.fields([
       { name: "avatar",
        maxCount:1
       },
       
       { name:"coverimage",
        maxCount:2
       }]),registerUser)
    router.route("/login").post(loginuser)
    router.route("/logout").post(verifyjwt,logoutuser)
    router.route("/refreshtokens").post(refreshaccesstoken)
    router.route("/change-password").post(verifyjwt,changepassword)
    router.route("/user").get(verifyjwt,getuser)
    router.route("/update-details").patch(verifyjwt,updateaccountdetails)
    router.route("avatar").patch(verifyjwt,upload.single("avatar"),updateavatar)
    router.route("/coverimage").patch(verifyjwt,upload.single("coverimage"),updatecoverimage)
    router.route("/chanel/:username").get(verifyjwt,getuserprofile)
    router.route("/history").get(verifyjwt,gethistory)

export default router    