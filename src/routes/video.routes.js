import { getAllVideos,getvidosById,publishVideo,updateVideo,
    deleteVideo,toggleIsPublished
 } from "../controllers/video.controllers.js";
 import { Router } from "express";
 import {verifyjwt} from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'


 const router = Router()
 router.use(verifyjwt)
 router.route("/").get(getAllVideos)
 router.route("/:videoId").get(getvidosById)
 .patch(updateVideo)
 .delete(deleteVideo)
 
 router.route("/publish").post(upload,publishVideo)
 router.route("/:videoId/publish").patch(toggleIsPublished)


 export default router