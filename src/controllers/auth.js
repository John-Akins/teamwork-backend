import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"

import db from "../db"

const authController = {}

authController.signin = (req, res) => {
	// Get input validation status
	const errors = validationResult(req)
	if (!errors.isEmpty()) 
	{
		return res.status(422).json({
			status: "error",
			error: errors.array()
		})				
	}

	const userEmail = req.body.email
	const userPassword = req.body.password	

	const query = {
		name: "fetch-user",
		text: "SELECT * FROM users WHERE email = $1",
		values: [userEmail]
	}
	db.queryWhere(query)
		.then((user) => {
			if(user[0] === undefined)
			{
				return res.status(401).json({
					status: "error",
					error: "incorrect email or password"
				})
			}
			else
			{
				const userId = user[0].userId 
				const isAdmin = user[0].isAdmin
				bcrypt.compare(userPassword, user[0].password)
					.then((valid) => {
						if(!valid)
						{
							return res.status(401).json({
								status: "error",
								error: "incorrect email or password"
							})
						} 
						const token = jwt.sign({userId: userId, isAdmin: isAdmin},"$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf",
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
					})
					.catch((error)  => {
						res.status(401).json({
							status: "error",
							error: "incorrect email or password",
						})                    
					})
			}
		})
		.catch((error) => {
			res.status(403).json({
				status: "error",
				error: "server error"
			})
		})
}


const emailExists = (email) => {
	return new Promise((resolve, reject) => {
		const query = {
			// give the query a unique name
			name: "fetch-user",
			text: "SELECT * FROM users WHERE email = $1",
			values: [email],
		}
		db.queryWhere(query)
			.then((user) => {
				if(user[0] !== undefined)
				{
					resolve(true)
				}
				resolve(false)
			})
			.catch((error) => {
				reject({
					status: "error",
					error: "could not perform request"
				})
			})
	})
}


authController.createUser = (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty())
	{
		return res.status(422).json({	
			status: "error",
			error: errors.array()
		})
	}
	
	const { firstName, lastName, email, address, password, gender, jobRole, department, isAdmin } = req.body

	emailExists(email)
		.then((isDuplicate) => {
			if(isDuplicate === true)
			{
				return res.status(402).json({
					status: "error",
					error: "this email already exists"
				})
			}
			else
			{
				const userId = new Date().getTime()
				const token = (! req.headers.authorization) ? "" : req.headers.authorization.split()[1]
				bcrypt.hash(password, 10).then(
					(hash) => {
						const query = {
							name: "create-user",
							text: "INSERT INTO users(\"userId\", \"firstName\", \"lastName\", \"email\", \"address\", \"password\", \"gender\", \"jobRole\", \"department\", \"isAdmin\", \"isNewAccount\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
							values: [userId, firstName, lastName, email, address, hash, gender, jobRole, department, isAdmin, true]
						}
						db.queryWhere(query)
							.then(() => {
								res.status(200).json({
									status : "success",
									data : {
										message: "User account successfully created",
										token : token,
										userId: userId,
										jobRole: jobRole
									}
								})		
							})
							.catch((error) => {
								res.status(500).json({
									status: "error",
									error: "Internal server error "  + error
								})	
							})		
					})
					.catch((error) => {
						res.status(500).json({
							status: "error",
							error: error
						})
					})
			}
		})
		.catch((error) => {
			res.status(500).json({
				status: "error",
				error: error
			})
		})

}

export default authController