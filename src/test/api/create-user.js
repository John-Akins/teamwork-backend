import chai from 'chai'
import chatHttp from 'chai-http'
import 'chai/register-should'
import app from '../../app'

chai.use(chatHttp);
const { expect } = chai;

describe("create user", () => {

	describe("admin create employee", () => {

		const adminSecrets = {}
		before((done) => {
			chai.request(app)
			.post('/api/v1/auth/signin')
			.set('Accept', 'application/json')
			.send({
				email: "lovelace@gmail.com",
				password: "password"
			})
			.end((error, response) => {
				adminSecrets.data = response.body.data
				done();
			});
		})

		describe("input existing email", () => {
			const data = {}
			before((done) => {
				chai.request(app)
				.post('/api/v1/auth/create-user')
				.set({
					'Accept': 'application/json',
					"Authorization": `token: ${adminSecrets.data.token}`
				})
				.send({
					userId: adminSecrets.data.userId,
					firstName: "akins",
					lastName: "akin",
					email: "turan@gmail.com",
					address: "akins street", 
					password: "dfjdskjfsk",
					gender: "male",
					jobRole: "Engineer",
					department: "IT",
					isAdmin: true
				})
				.end((error, response) => {
					data.status = response.statusCode
					data.body = response.body
					done();
				});
			})

			it("should return 402 status code", () => {
				expect(data.status).to.equal(402)
			})
			it("should return relevant error message", () => {
				expect(data.body.error).eql("this email already exists")
			})
		})

		describe("empty field(s)/ wrong input format", () => {
			const data = {}
			before((done) => {
				chai.request(app)
				.post('/api/v1/auth/create-user')
				.set({
					'Accept': 'application/json',
					"Authorization": `token: ${adminSecrets.data.token}`
				})
				.send({
					userId: adminSecrets.data.userId,
					firstName: "",
					lastName: "",
					email: "",
					address: "", 
					password: "",
					gender: "",
					jobRole: "",
					department: "",
					isAdmin: false
				})
				.end((error, response) => {
					data.status = response.statusCode
					data.body = response.body
					done();
				});
			})

			it("should return 422 status code", () => {
				expect(data.status).to.equal(422)
			})
			it("should return an error array", () => {
				expect(data.body.error).to.be.an('array')
			})
		})
	})

	describe("user create employee", () => {
		const userSecrets = {}	

		before((done) => {
			chai.request(app)
			.post('/api/v1/auth/signin')
			.set('Accept', 'application/json')
			.send({
				email: "turan@gmail.com",
				password: "password"
			})
			.end((error, response) => {
				userSecrets.data = response.body.data
				done();
			});
		})

		describe("user not an admin", () => {
			const data = {}
			before((done) => {
				chai.request(app)
				.post('/api/v1/auth/create-user')
				.set({
					'Accept': 'application/json',
					"Authorization": `token: ${userSecrets.data.token}`
				})
				.send({
					userId: userSecrets.data.userId,
					firstName: "sola",
					lastName: "akin",
					email: "akins@gmail.com",
					address: "akins street", 
					password: "dfjdskjfsk",
					gender: "male",
					jobRole: "Engineer",
					department: "IT",
					isAdmin: false,
				})
				.end((error, response) => {
					data.status = response.statusCode
					data.body = response.body
					done();
				});
			})

			it("should return 401 status code", () => {
				expect(data.status).to.equal(401)
			})
			it("should return error relevant message", () => {
				expect(data.body.error).eql("Elevated access rights required")
			})
		})
	})	
})
