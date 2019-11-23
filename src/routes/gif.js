import express from "express"
import validator from "../middleware/input-validator"
import auth from "../middleware/auth"
import multer from "../middleware/multer-config"
import gifController  from "../controllers/gif"
import validateRequest from "../utilities/validateRequest"

const router = express.Router()

router.post("/", auth.allUsers, multer.multerUploads, validator.createGif, validateRequest, gifController.createGif)

router.delete("/:gifId", auth.userIdMatchesAuthorId, validator.deleteGif, validateRequest, gifController.deleteGif)

router.post("/:gifId/comment", auth.allUsers, validator.commentGif, validateRequest, gifController.commentGif)

export default router
