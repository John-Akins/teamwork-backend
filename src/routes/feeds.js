import express from "express"
import inputValidator from "../middleware/input-validator"
import auth from "../middleware/auth"
import feedController  from "../controllers/feeds"

const router = express.Router()

/**
* @api {get} /api/feed
* @apiName Get all feed
* @apiPermission authorized users
* @apiGroup feeds
*
* @apiSuccess (200) {Object} mixed `Response` object
*
*/

router.get( "/", auth.allUsers, inputValidator.getFeeds, feedController.getFeeds )

export default router