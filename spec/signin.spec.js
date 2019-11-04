const Request = require("request")
const server = require("../src/app")

describe("admin or employee sign in", () =>  {
	describe("incorrect email and/or password", () => {
		const data = {}
		beforeAll((done) => {
			Request.post({
				url: "http://localhost:8080/api/v1/auth/signin",
				method: "POST",
				body: {
					email: "email",
					password: "password"
				},
				json: true
			}, 
			(error, response, body) => {
				console.log("body: ")
				console.log(body)
				data.status = response.statusCode
				data.body = response.body
				done()
			})
		})		
		it("should return 401 status code", () => {
			expect(data.status).toBe(401)
		})
		it("should return relevant error message", () => {
			expect(data.body.error).toBe("incorrect email or password")
		})
	})
	describe("correct email and password", () => {
		const data = {}
		beforeAll((done) => {
			Request.post({
				url: "http://localhost:8080/api/v1/auth/signin",
				method: "POST",
				body: {
					email: "lovelace@gmail.com",
					password: "password"
				},
				json: true
			},
			(error, response, body) => {
				data.status = response.statusCode
				data.bodyData = body.data
				done()
			})
		})		
		it("should return 200 status code", () => {
			expect(data.status).toBe(200)
		})
		it("should sign the response header with JWT", () => {
			expect(data.bodyData.userId).toBe(10001)
		})
	})
})