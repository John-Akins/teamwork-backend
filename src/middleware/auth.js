import jwt from "jsonwebtoken"
import responseUtility from "../utilities/responsUtility"

const auth = {}

auth.allUsers = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf")
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
		const decodedToken = jwt.verify(token, "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf")
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
			return	responseUtility.error(res, 401, "Unauthorized request")
		}
	}
	catch(e) {
		return	responseUtility.error(res, 401, "Unauthorized request")
	}
}

export default auth