import express from "express"
import inputValidator from "../middleware/input-validator"
import auth from "../middleware/auth"
import articlesController  from "../controllers/articles"

const router = express.Router()

/**
* @api {get} /api/articles/<:tag>
* @apiName Create article 
* @apiPermission authorized users
* @apiGroup articles
*
* @apiParam  {String} [userId] userId
* @apiParam  {String} [title] title
* @apiParam  {String} [article] article
* @apiParam  {Boolean} [isAdmin] isAdmin
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.post("/", auth.allUsers, inputValidator.createArticle, articlesController.createArticle)

/**
* @api {get} /api/articles/<:tag>
* @apiName Comment on article 
* @apiPermission authorized users
* @apiGroup articles
*
* @apiParam  {String} [userId] userId
* @apiParam  {String} [id] id
* @apiParam  {String} [comment] comment
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.post("/:id/comment", auth.allUsers, inputValidator.commentArticle, articlesController.commentArticle)

/**
* @api {get} /api/articles/<:tag>
* @apiName Create article 
* @apiPermission authorized users
* @apiGroup articles
*
* @apiParam  {String} [articleId] articleId
*
* @apiBody  {String} [userId] userId
* @apiBody  {String} [title] title
* @apiBody  {String} [article] article
* @apiBody  {Boolean} [isAdmin] isAdmin
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.patch("/:articleId", auth.allUsers, auth.userIdMatchesArticleId, inputValidator.editArticle, articlesController.editArticle)

/**
* @api {get} /api/articles/<:tag>
* @apiName Flag article 
* @apiPermission authorized users
* @apiGroup articles
*
* @apiParam  {String} [articleId] articleId
*
* @apiBody  {String} [userId] userId
* @apiBody  {String} [title] title
* @apiBody  {String} [article] article
* @apiBody  {String} [id] id
* @apiBody  {String} [authorId] authorId
* @apiBody  {String} [userId] userId
* @apiBody  {Boolean} [isAdmin] isAdmin
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.patch("/:articleId/flag", auth.allUsers, inputValidator.getArticlesById, articlesController.flagArticle)

/**
* @api {get} /api/articles/<:articleId>
* @apiName Get all id
* @apiPermission authorized users
* @apiGroup articles
*
* @apiParam  {String} [articleId] articleId
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.get("/:articleId", auth.allUsers, inputValidator.getArticlesById, articlesController.getArticlesById)

/**
* @api {get} /api/articles/tags/<:tag>
* @apiName Get articles by tag 
* @apiPermission authorized users
* @apiGroup articles
*
* @apiParam  {String} [tag] tag
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.get("/tags/:tag", auth.allUsers, inputValidator.getArticlesByTag, articlesController.getArticlesByTag)

/**
* @api {delet} /api/articles/<:articleId>
* @apiName Delete article by id
* @apiPermission authorized users
* @apiGroup articles
*
* @apiParam  {String} [articleId] articleId
*
* @apiBody  {String} [userId] userId
* @apiBody  {String} [id] id
* @apiBody  {String} [authorId] authorId
* @apiBody  {Boolean} [isAdmin] isAdmin
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.delete("/:articleId", auth.allUsers, auth.userIdMatchesArticleId, inputValidator.getArticlesById, articlesController.deleteArticlesById)

/**
* @api {delet} /api/articles/flagged/<:articleId>
* @apiName Delete article by id
* @apiPermission admin only
* @apiGroup articles
*
* @apiParam  {String} [articleId] articleId
*
* @apiBody  {String} [userId] userId
* @apiBody  {String} [id] id
* @apiBody  {Boolean} [isAdmin] isAdmin
*
* @apiSuccess (200) {Object} mixed `Response` object
*/

router.delete("/flagged/:articleId", auth.adminOnly, inputValidator.getArticlesById, articlesController.deleteFlaggedArticle)

export default router