import { addVideoInPlaylist,removeVideoInPlaylist,updatePlaylist,
    createPlaylist,getPlaylistById,getUserPlaylists
 } from "../controllers/playlist.controllers.js";
 import { Router } from "express";
 import {verifyjwt} from '../middlewares/auth.middleware.js'

 const router = Router()
 router.use(verifyjwt)
 router.route("/user/:userId").get(getUserPlaylists)
 router.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist)
 router.route("/").post(createPlaylist)
 router.route("/:playlistId/:videoId").post(addVideoInPlaylist)
 router.route("/:playlistId/:videoId").delete(removeVideoInPlaylist)
 export default router
 