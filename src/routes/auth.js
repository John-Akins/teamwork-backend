import express from "express"
import validator from "../middleware/input-validator"
import auth from "../middleware/auth"
import authController  from "../controllers/auth"
import validateRequest from "../utilities/validateRequest"

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

router.post("/signin", validator.signin, authController.signin)

/**
* @api {post} /api/auth/create-user
* @apiName Create user
* @apiPermission admin
* @apiGroup Auth
*
* @apiParam  {String} [firstName] Firstname
* @apiParam  {String} [lastName] Lastname
* @apiParam  {String} [email] Email
* @apiParam  {String} [address] Address
* @apiParam  {String} [password] Password
* @apiParam  {String} [gender] Gender
* @apiParam  {String} [jobRole] JobRole
* @apiParam  {String} [department] Department
* @apiParam  {Boolean} [isAdmin] isAdmin
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.post("/create-user", auth.adminOnly, validator.createUser, validateRequest,authController.createUser)

export default router