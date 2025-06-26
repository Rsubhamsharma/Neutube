import { Router } from "express";
import {loginuser, logoutuser, refreshaccesstoken, registerUser} from '../controllers/User.controllers.js'


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

export default router    