import db from "../db"

const testQueries = {}


testQueries.getMaxArticle = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT title, "articleId" as id, "createdOn", "createdBy" as "authorId", article FROM articles WHERE "articleId" = (SELECT MAX("articleId") FROM articles)')
			.then((response) => {
				resolve(response.rows[0])
			})
			.catch((error) => {
				reject({status: "error", error: error})
			})
	})
}

testQueries.commentOnArticle = () => {
	return new Promise((resolve, reject) => {
		const dateTime = new Date()
		const randId = new Date().getTime()
	
		const query = {
				text: 'INSERT INTO "feedComments" (id, "feedId", "feedType", comment, "commentOn", "commentBy", "isFlagged") values  ($1, $2, \'article\', $3, $4, $5,FALSE)',
				values: [randId, 10001, "comment", dateTime, 10001]
			}
		
			db.query(query)
			.then(() => {
				resolve(randId)
			})
			.catch((error) => {
				reject(error)
			})		
	})
}

testQueries.createAndFlagArticle = () => {
	return new Promise((resolve, reject) => {
		const dateTime = new Date()
		const articleId = new Date().getTime()
		const userId = 10001
		const title = "aksf akdfnak dkasnddlknsd"
		const article = "aksf akdfnak sadlnasdfk sddknsdflkas asdl;kkansdknasd dkasnddlknsd"
		const randomId = new Date().getTime()
	
		const queryArray = [
			{
				text: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article", "isEdited", "isFlagged") values  ($1, $2, $3, $4, $5, FALSE, TRUE)',
				values: [title, articleId, dateTime, userId, article]
			},
			{
				text: 'INSERT INTO "flaggedFeeds"( "flagId", "feedId", "feedType", "flaggedOn", "flaggedBy") VALUES ($1, $2, $3, $4, $5)',
				values: [randomId, articleId, "article", dateTime, userId]
			}
		]
		
		db.transactQuery(queryArray)
			.then(() => {
				resolve({ id: articleId, article: article, title: title })
			})
			.catch((error) => {
				reject({status: "error", error: error})
			})	
	})
}

export default testQueries