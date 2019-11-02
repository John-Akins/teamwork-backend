const { jwt } = require("jsonwebtoken")

const auth = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, "RANDOM_TOKEN_STRING")
		const userId = decodedToken.userId
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
			error: "Unauthorized request"
		})
	}
}

module.exports = auth