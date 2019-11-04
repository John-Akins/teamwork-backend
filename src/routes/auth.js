const express = require("express")
//import auth from "../middleware/auth.js"
const authCtrl = require("../controllers/auth")
const inputValidator = require("../middleware/input-validator")

const router = express.Router()

/**
* @api {post} /api/auth/signin
* @apiName User sign in
* @apiPermission admin,employee
* @apiGroup Auth
*
* @apiParam  {String} [email] Email
* @apiParam  {String} [password] Password
*
* @apiSuccess (200) {Object} mixed `User` object
*/

router.post("/signin", inputValidator.signin, authCtrl.signin)

module.exports = router