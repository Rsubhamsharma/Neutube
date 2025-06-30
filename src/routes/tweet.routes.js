import { Router } from "express";

import { postTweet,getTweet,updateTweet,deleteTweet } from "../controllers/tweet.controllers.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyjwt)
router.route("/").post(postTweet)
router.route("/:tweetId")
.get(getTweet)
.patch(updateTweet)
.delete(deleteTweet)

export default  router