import jwt from "jsonwebtoken"
import responseUtility from "../utilities/responseUtility"

const auth = {}
const tokenSecret = "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf"

auth.allUsers = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, tokenSecret)
		try{
			const { userId } = decodedToken
			if( req.body.userId && req.body.userId !== userId ) {
				throw "Invalid user ID"
			}
			else {
				next()
			}
		}
		catch(e) {
			return	responseUtility.error(res, 401, "Unauthorized request")
		}
	}
	catch(e) {
		return	responseUtility.error(res, 401, "Unauthorized request")
	}
}

auth.adminOnly = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, tokenSecret)
		const { userId, isAdmin } = decodedToken

	
		try {
			if( req.body.userId && req.body.userId !== userId ) {
				throw "Invalid user ID"
			}
			if( isAdmin !== true ) {
				throw "Elevated access rights required"
			}
			else {
				next()
			}
		}
		catch(e) {
			return	responseUtility.error(res, 401, e)
		}
	}
	catch(e) {
		return	responseUtility.error(res, 401, "Unauthorized request")
	}
}

auth.userIdMatchesArticleId = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, tokenSecret)
		const { userId } = decodedToken
		
		try {
			if( userId && parseInt(userId) !== parseInt(req.body.authorId) ) {
				throw "Only admin or account owner can edit/delete this article, want to flag as inappropriate?"
			}
			else {
				next()
			}
		}
		catch(e) {
			return	responseUtility.error(res, 401, e)
		}
	}
	catch(e) {
		return	responseUtility.error(res, 401, "Unauthorized request")
	}
}

export default auth