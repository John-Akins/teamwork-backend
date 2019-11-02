const db = require("../db")

exports.getAllArticles = (req, res) => {
	db.queryAll("SELECT * FROM articles")
		.then((response) => {
			res.status(200).json({
				status: "success",
				data: response})
		})
		.catch((error) => {
			console.error(error)
			res.status(400).json({
				status: "error",
				error: "Data retrieval failed"
			})
		})
}

exports.getOneArticle =(req, res) => {
	db.queryAll("SELECT * FROM articles")
		.then((response) => {
			res.status(200).json({
				message: "Success",
				data: response
			})
		})
		.catch((error) => {
			console.error(error)
			res.status(400).json({
				error: "Error: "+ error
			})
		})

}