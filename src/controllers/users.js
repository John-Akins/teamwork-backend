const bcrypt = import("bcrypt")
const {jwt} = import("jsonwebtoken")
const User = import("../models/user")

const signup = (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then(
		(hash) => {
			const user = new User({
				email: req.body.email,
				password: hash
			})
			user.save().then(
				() => {
					res.status(201).json({
						message: "User added successfully"
					})
				}
			)
				.catch((error) => {
					res.status(500).json({
						error: error
					})
				})
		}
	)
}

const login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if(!user)
			{
				console.log("email not found")
				return res.status(401).json({
					error: "Incorrect Username or password"
				})        
			}
			bcrypt.compare(req.body.password, user.password)
				.then((valid) => {
					if(!valid)
					{
						return res.status(401).json({
							error: "Incorrect Username or password"
						})    
					}
					const token = jwt.sign(
						{userId: user._id}, "RANDOM_TOKEN_STRING",
						{expiresIn: "24h"}
					)
					res.status(200).json({
						userId: user._id,
						token: token
					})
				})
				.catch((error) => {
					res.status(500).json({
						error: "Incorrect Username or password"
					})
				})
		})
		.catch((error)=>{
			res.status(500).json({
				error: error
			})
		})
}
export default {signup, login}