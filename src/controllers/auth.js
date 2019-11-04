const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

const db = require("../db")

exports.signin = (req, res) => {
	// Get input validation status
	const errors = validationResult(req)
	if (!errors.isEmpty()) 
	{
		res.status(422).json({
			status: "error",
			error: errors.array()
		})				
	}

	const userEmail = req.body.email
	const userPassword = req.body.password	
	
	const query = {
		// give the query a unique name
		name: "fetch-user",
		text: "SELECT * FROM users WHERE email = $1",
		values: [userEmail],
	}
	db.queryWhere(query)
		.then((user) => {
			if(!user)
			{
				res.status(401).json({
					status: "error",
					error: "incorrect email or password"
				})
			}
			bcrypt.compare(userPassword, user[0].password)
				.then((valid) => {
					if(!valid)
					{
						res.status(401).json({
							status: "error",
							error: "incorrect email or password"
						})
					}
					else{
						const token = jwt.sign(
							{userId: user[0].userId}, 
							"$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf", 
							{expiresIn: "24h"}
						)
						res.status(200).json({
							status : "success",
							data : {
								token : token,
								userId: user[0].userId,
								jobRole: user[0].jobRole
							}
						})           
					}
				})
				.catch((error)  => {
					res.status(401).json({
						status: "error",
						error: "incorrect email or password"
					})                    
				})
		})
		.catch((error) => {
			res.status(401).json({
				status: "error",
				error: "incorrect email or password"
			})
		})
}

