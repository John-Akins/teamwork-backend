import jwt from "jsonwebtoken"

const auth = {}

auth.allUsers = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf")
		try{
			const { userId } = decodedToken
			if( req.body.userId && req.body.userId !== userId )
			{
				throw "Invalid user ID"
			}
			else
			{
				next()
			}
		}
		catch(e) {
			res.status(401).json({
				error: e
			})
		}
	}
	catch(e) {
		res.status(401).json({
			error: "Unauthorized request" + e
		})
	}
}

auth.adminOnly = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf")
		const { userId, isAdmin } = decodedToken
		try {
			if( req.body.userId && req.body.userId !== userId )
			{
				throw "Invalid user ID"
			}
			if( isAdmin !== true )
			{
				throw "Elevated access rights required"
			}
			else
			{
				next()
			}
		}
		catch(e) {
			res.status(401).json({
				error: e
			})
		}
	}
	catch(e) {
		console.log(e)
		res.status(401).json({
			error: "Unauthorized request"
		})
	}
}

export default auth