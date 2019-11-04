const { body,sanitizeBody } = require("express-validator")

exports.signin = [
	body("email", "email cannot be empty").not().isEmpty().isEmail(), 
	body("password", "password cannot be empty").not().isEmpty().isLength({ min: 5 }),
	sanitizeBody("email").trim().escape(),
	sanitizeBody("password").trim().escape(),
]
