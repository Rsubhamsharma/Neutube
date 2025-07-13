import { getChannelSubscriber,getSubscribedChannels
    ,toggleSubscriber } from "../controllers/subsciption.controllers.js";
    import { Router } from "express";
    import {verifyjwt} from "../middlewares/auth.middleware.js"
    const router = Router()
    router.use(verifyjwt)
    router.route("/:channelId").patch(toggleSubscriber)
    .get(getChannelSubscriber)
    router.route("/:subscriberId").get(getSubscribedChannels)


    export default router