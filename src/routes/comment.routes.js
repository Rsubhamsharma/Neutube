import { createComment,getcomment,updateComment,deleteComment } from "../controllers/commentcontrollers.js";
import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
const router = Router()
router.use(verifyjwt)

router.route("/:videoId").get(getcomment).post(createComment)

router.route("/:commentId")
.patch(updateComment)
.delete(deleteComment)
 


export default router