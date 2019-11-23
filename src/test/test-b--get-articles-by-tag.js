import chai from 'chai'
import chatHttp from 'chai-http'
import 'chai/register-should'
import app from '../app'

chai.use(chatHttp);
const { expect } = chai;

describe('get articles by tag', () => {
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
            done()
        });
    })

    describe('user is authorized', () => {
        const data = {}
        before((done) => {
            chai.request(app)
            .get('/api/v1/articles/tags/news')
            .set({
                'Accept': 'application/json',
                "Authorization": `token: ${adminSecrets.data.token}`
            })
            .send({
                userId: adminSecrets.data.userId,
                isAdmin: adminSecrets.data.isAdmin
            })
            .end((error, response) => {
                data.status = response.statusCode
                data.body = response.body
                done()
            })
        })        

        it("should return 200 status code", () => {
			expect(data.status).to.equal(200)                
        })
        it("should return relevant success message", () => {
			expect(data.body.status).to.eql('success')
        })
        it("should return an array of articles", () => {
            expect(data.body.data).to.be.an('array')
        })

        describe("tag exceeds 50 characters", () => {
            const data = {}
            before((done) => {
                chai.request(app)
                .get('/api/v1/articles/tags/newsoeojeffdkfndknfkdnfkndknfkdnfkdnfkndkfnsdknfdnfskjnfsdjnfkjnfdjnfjnjdsfjdskjfnskjdfjsdfkjsdfjsbdfjbsdfkjsdfkjbdjbj')
                .set({
                    'Accept': 'application/json',
                    "Authorization": `token: ${adminSecrets.data.token}`
                })
                .send({
                    userId: adminSecrets.data.userId,
                    isAdmin: adminSecrets.data.isAdmin
                })
                .end((error, response) => {
                    data.status = response.statusCode
                    data.body = response.body
                    done()
                })
            })        
    
            it("should return error status", () => {
                expect(data.body.status).to.eql('error')
            })
            it("should return 422 status code", () => {
				expect(data.status).to.equal(422)                
            })
            it("should return an error array ", () => {
				expect(data.body.error).to.be.an('array')
            })
        })

    })

    describe('user is unauthorized', () => {
		const maliciousSecret = {token: "d@u30ur8038###(09@)(@(29299safosfshaj", userId: 10001, isAdmin: true}
        const data = {}
        before((done) => {
            chai.request(app)
            .get('/api/v1/articles/tags/news')
            .set({
                'Accept': 'application/json',
                "Authorization": `token: ${maliciousSecret.token}`
            })
            .send({
                userId: maliciousSecret.userId,
                isAdmin: maliciousSecret.isAdmin
            })
            .end((error, response) => {
                data.status = response.statusCode
                data.body = response.body
                done()
            });
        })
        it("should return 401 status code", () => {
            expect(data.status).to.equal(401)
        })
        it("should return relevant error message", () => {
            expect(data.body.error).eql("Unauthorized request")
        })        
    })
})
