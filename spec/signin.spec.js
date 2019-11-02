const Request = require("request")

describe("admin or employee sign in", function()  {
	let server
	beforeAll(() => {
		server = require("../src/app")
	})
	afterAll(() => {
		server.close()
	})
	describe("incorrect username and/or password", () => {
		const data = {}
		beforeAll((done) => {
			Request.post({
				url: "http://localhost:8080/api/v1/auth/signin",
				method: "POST",
				json: {
					username: "username",
					password: "password"
				}
			}, 
			(error, response, body) => {
				data.status = response.statusCode
				data.body = body
				data.headers = response.headers
				done()
			})
		})		
		it("should return 401 status code", () => {
			expect(data.status).toBe(401)
		})
		it("should return relevant error message", () => {
			expect(data.body.data).toBe("incorrect username or password")
		})
	})
	describe("correct username and password", () => {
		const data = {}
		beforeAll((done) => {
			Request.post({
				url: "http://localhost:8080/api/v1/auth/signin",
				method: "POST",
				json: {
					username: "username",
					password: "password"
				}
			}, 
			(error, response, body) => {
				data.status = response.statusCode
				data.body = body
				data.headers = response.headers
				done()
			})
		})		
		it("should return 200 status code", () => {
			expect(data.status).toBe(200)	
		})
		it("should sign the response header with JWT", () => {
			expect(data.headers.userId).toBe(10001)	
		})
	})
})