import { validationResult } from "express-validator"
import responseUtility from "../utilities/responseUtility"
import db from "../db"
import comments from "./comments"

const articlesController = {}

const isArticleFlagged = (articleId) => {
	return new Promise((resolve, reject) => {
	const query = {
				text: 'SELECT title, "articleId" as id, "createdOn", "createdBy" as "authorId", article FROM articles WHERE "articleId" = $1 AND "isFlagged" = TRUE',
				values: [articleId]
		}
		db.query(query)
			.then((response) => {
				const data = response.rows
				if(data[0] !== undefined && typeof data[0].title === 'string'){
					resolve(true)
				}
				resolve(false)
			})
			.catch(( error ) => {
				reject(false)
			})
		})
}

articlesController.createArticle = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}

	const { title, article, userId, isAdmin } = req.body
    const dateTime = new Date()
	const articleId = new Date().getTime()
    const token = req.headers.authorization.split()[1]

    const query = {
			text: 'INSERT INTO articles (title, "articleId", "createdOn", "createdBy", article, "isEdited") values  ($1, $2, $3, $4, $5, FALSE)',
			values: [title, articleId, dateTime, userId, article]
		}
		db.query(query)
			.then(() => {
				const data = { message: "Article successfully posted", articleId: articleId, createdOn: dateTime, title: title,token : req.headers.authorization.split()[1], userId: userId}
				responseUtility.success(res, data)
			})
			.catch(( error ) => { 
				responseUtility.error(res, 500, "server error") 
			})
}

articlesController.commentArticle = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}

	const { id, comment, userId } = req.body
    const dateTime = new Date()
	const randId = new Date().getTime()
	
	comments.add( id, randId, comment, dateTime,  'article', userId )
		.then((response) => {
			const data = { message: "comment posted succesfully", commentId: randId, createdOn: dateTime, token : req.headers.authorization.split()[1], commentBy: userId, userId: userId }
			return responseUtility.success(res, data)
		})
		.catch(( error ) => { 
			responseUtility.error(res, 500, "server error") 
		})
}

articlesController.editArticle = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	
	
	const { title, article, userId, isAdmin, articleId } = req.body

    const query = {
			text: 'UPDATE articles SET title=$1, article=$2, "isEdited"=TRUE WHERE  "articleId"=$3 ',
			values: [title, article, articleId]
		}	
		db.query(query)
			.then(() => {
				const data = { message: "Article successfully updated", articleId: articleId, title: title, article: article, token : req.headers.authorization.split()[1], userId: userId}
				responseUtility.success(res, data)
			})
			.catch(( error ) => { 
				responseUtility.error(res, 500, "server error") 
			})
}

articlesController.flagArticle = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	

	const randomId = new Date().getTime()
	const dateTime = new Date()	

	const queryArray = [ 	
		{
			text: 'UPDATE articles SET "isFlagged"=TRUE WHERE "articleId"=$1 ', values: [ req.params.articleId ]
		},
		{
			text: 'INSERT INTO "flaggedFeeds"( "flagId", "feedId", "feedType", "flaggedOn", "flaggedBy") VALUES ($1, $2, $3, $4, $5)', values: [randomId, req.params.articleId, "article", dateTime, req.body.userId]
		}
	]
	db.transactQuery(queryArray)
		.then(() => {
			const data = { message: "Article successfully flagged as inappropriate", token : req.headers.authorization.split()[1], userId: req.body.userId}
			responseUtility.success(res, data)
		})
		.catch(( error ) => { 
			responseUtility.error(res, 500, "server error") 
		})
}

articlesController.flagArticleComment = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	

	comments.flag(req.params.commentId, 'article')
		.then((response) => {
			if(response !== "success") {
				return responseUtility.error(res, 401, response.msg)
			}
			const data = { message: "Comment successfully flagged as inappropriate", token : req.headers.authorization.split()[1], userId: req.body.userId}
			responseUtility.success(res, data)
		})
		.catch(( error ) => { 
			responseUtility.error(res, 500, "server error") 
		})
}

articlesController.deleteFlaggedComment = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	

	comments.deleteFlagged(req.params.commentId)
		.then((response) => {
			if(response !== "success") {
				return responseUtility.error(res, 401, response.msg)
			}
			const data = { message: "Comment successfully deleted", token : req.headers.authorization.split()[1], userId: req.body.userId}
			responseUtility.success(res, data)
		})
		.catch(( error ) => { 
			responseUtility.error(res, 500, "server error") 
		})
}

articlesController.deleteFlaggedArticle = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	

	isArticleFlagged(req.params.articleId)
	.then((isFlagged) => {
		if( isFlagged === false){
			return responseUtility.error(res, 401, "You cannot delete an unflagged article, want to flag as inappropriate?")		
		}		
		const queryArray = [ 	
			{ text: 'DELETE FROM articles WHERE  "articleId"=$1', values: [ req.params.articleId ] }, 
			{ text: 'DELETE FROM "flaggedFeeds" WHERE "feedId"=$1 ', values: [ req.params.articleId ] }
		]
		db.transactQuery(queryArray)
			.then(() => {
				const data = { 
					message: "Article successfully deleted", 
					token : req.headers.authorization.split()[1], userId: req.body.userId
				}
				responseUtility.success(res, data)
			})
			.catch(( error ) => { 
				responseUtility.error(res, 500, "server error") 
			})
	})
	.catch(( error ) => { 
		responseUtility.error(res, 500, "server error") 
	})
}

articlesController.getArticlesByTag = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	
	const query = {
				text: 'SELECT a.title, a."articleId" as id, a."createdOn", a."createdBy" as "authorId", a.article FROM articles as a  INNER JOIN "articleTags" ON "articleTags"."articleId" = a."articleId" INNER JOIN tags ON tags.id = "articleTags"."tagId" WHERE tags.name = $1 ORDER BY "createdOn" desc ',
				values: [req.params.tag]
		}
		db.query(query)
			.then((response) => {
				responseUtility.success(res, response.rows)
			})
			.catch(( error ) => { 
				responseUtility.error(res, 500, "server error") 
			})
}

articlesController.getArticlesById = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	
	;(async() => {
		const query = {
			text: 'SELECT title, "articleId" as id, "createdOn", "createdBy" as "authorId", article FROM articles WHERE "articleId" = $1 ',
			values: [req.params.articleId]
		}
		try {
			const response = await db.query(query)
			response.rows[0].comments = await comments.getByFeedId(req.params.articleId, 'article')
			responseUtility.success(res, response.rows[0])
		}
		catch( error ) { 
			responseUtility.error(res, 500, "server error") 
		}
	})()	
}

articlesController.deleteArticlesById = (req, res) => {
	const errors = validationResult(req)
	if ( !errors.isEmpty() ) {
		return responseUtility.error(res, 422, errors.array())
	}	
	const query = {
				text: 'DELETE FROM articles WHERE "articleId" = $1 ',
				values: [req.params.articleId]
		}
		db.query(query)
			.then((response) => {
				const data = {message: "Article successfully deleted"}
				responseUtility.success(res,  data)
			})
			.catch(( error ) => { 
				responseUtility.error(res, 500, "server error") 
			})
}

export default articlesController