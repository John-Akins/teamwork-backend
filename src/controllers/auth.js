import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import responseUtility from "../utilities/responseUtility"
import db from "../db"

const authController = {}
const tokenSecret = "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf"

authController.signin = (req, res) => {
	const query = {
		text: "SELECT * FROM users WHERE email = $1",
		values: [req.body.email]
	}
	db.query(query)
		.then((user) => {
			if (user.rows[0] === undefined) {
			    return	responseUtility.error(res, 401, "incorrect email or password")
			}

			bcrypt.compare(req.body.password, user.rows[0].password)
				.then((valid) => {
					if(!valid) {
						responseUtility.error(res, 401, "incorrect email or password")
					}

					const token = jwt.sign({userId: user.rows[0].userId, isAdmin: user.rows[0].isAdmin}, tokenSecret, {expiresIn: "24h"})
					const data = { token : token, userId: user.rows[0].userId, jobRole: user.rows[0].jobRole }		

					responseUtility.success(res, data)
				})
				.catch((error)  => {
					responseUtility.error(res, 401, "incorrect email or password")
				})
		})
		.catch((error) => {
			responseUtility.error(res, 500, "server error")
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
		db.query(query)
			.then((user) => {
				if(user.rows[0] !== undefined)
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
	const { firstName, lastName, email, address, password, gender, jobRole, department, isAdmin } = req.body

	emailExists(email)
		.then((isDuplicate) => {
			if(isDuplicate === true)	{
				return responseUtility.error(res, 402, "this email already exists")
			}

			const userId = new Date().getTime()
			const token = (! req.headers.authorization) ? "" : req.headers.authorization.split()[1]
			bcrypt.hash(password, 10)
			.then((hash) => {
					const query = {
							text: "INSERT INTO users(\"userId\", \"firstName\", \"lastName\", \"email\", \"address\", \"password\", \"gender\", \"jobRole\", \"department\", \"isAdmin\", \"isNewAccount\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
						values: [userId, firstName, lastName, email, address, hash, gender, jobRole, department, isAdmin, true]
					}
					db.query(query)
						.then(() => {
							const data = { message: "User account successfully created", token : token, userId: userId, jobRole: jobRole }
							responseUtility.success(res, data)
						})
						.catch((error) => {
							responseUtility.error(res, 500, "server error")
						})		
				})
				.catch((error) => {
					responseUtility.error(res, 500, "server error")
				})
		})
		.catch((error) => {
			responseUtility.error(res, 500, "server error")
		})
}

export default authController