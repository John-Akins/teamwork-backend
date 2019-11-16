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

testQueries.flagArticle = () => {
	
}

export default testQueries