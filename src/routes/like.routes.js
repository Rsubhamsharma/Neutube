import { Router } from "express";
import { toggleCommentLike,toggleTweetLike,toggleVideoLike,
getAllLikedVideos } from "../controllers/like.controllers.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";


const router = Router()
router.use(verifyjwt)
router.route("/video/:videoId").post(toggleVideoLike)
router.route("/comment/:commentId").post(toggleCommentLike)
router.route("/tweet/:tweetId").post(toggleTweetLike)
router.route("/likedVideos").get(getAllLikedVideos)


export default  router
