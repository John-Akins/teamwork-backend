import chai from 'chai'
import chatHttp from 'chai-http'
import 'chai/register-should'
import app from '../../../app'

chai.use(chatHttp)
const { expect } = chai

const loriumIpsium = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.   At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."


describe('edit article', () => {
    describe('user owns article', () => {
        const articleOwnerSecrets = {}
        const article = {}
    
        before((done) => {
            //login as article owner
            chai.request(app)
            .post('/api/v1/auth/signin')
            .set('Accept', 'application/json')
            .send({
                email: "lovelace@gmail.com",
                password: "password"
            })
            .end((error, response) => { 
                articleOwnerSecrets.data = response.body.data
                    chai.request(app)
                    .get('/api/v1/articles/10001')
                    .set({
                        'Accept': 'application/json',
                        "Authorization": `token: ${articleOwnerSecrets.data.token}`
                    })
                    .send({
                        userId: articleOwnerSecrets.data.userId,
                        isAdmin: articleOwnerSecrets.data.isAdmin,
                    })
                    .end((error, response) => {
                        article.body = response.body.data
                        console.log("response :::::::::::")
                        console.log(response.body.data)
                        done()
                    })
                })
            })

            describe('article more than 1000 words', () => {
                const data = {}
                before((done) => {
                    chai.request(app)
                    .patch('/api/v1/articles/10001')
                    .set({
                        'Accept': 'application/json',
                        "Authorization": `token: ${articleOwnerSecrets.data.token}`
                    })
                    .send({
                        userId: articleOwnerSecrets.data.userId,
                        isAdmin: articleOwnerSecrets.data.isAdmin,
                        id: article.body.id,
                        title: "Lorium Ipsium",
                        authorId: article.body.authorId,
                        article: loriumIpsium
                    })
                    .end((error, response) => {
                        data.status = response.statusCode
                        data.body = response.body
                        done()
                    })
                })
                it("should return 422 status code", () => {
                    expect(data.status).to.equal(422)                
                })
                it("should return an error array ", () => {
                    expect(data.body.error).to.be.an('array')
                })
            })

            describe('article or title empty', () => {
                const data = {}
                before((done) => {
                    chai.request(app)
                    .patch('/api/v1/articles/10001')
                    .set({
                        'Accept': 'application/json',
                        "Authorization": `token: ${articleOwnerSecrets.data.token}`
                    })
                    .send({
                        userId: articleOwnerSecrets.data.userId,
                        isAdmin: articleOwnerSecrets.data.isAdmin,
                        id: article.body.id,
                        title: "",
                        authorId: article.body.authorId,
                        article: loriumIpsium
                    })
                    .end((error, response) => {
                        data.status = response.statusCode
                        data.body = response.body
                        done()
                    })
                })
                it("should return 422 status code", () => {
                    expect(data.status).to.equal(422)                
                })
                it("should return an error array", () => {
                    expect(data.body.error).to.be.an('array')
                })
            })

            
        describe('article and title formatted correctly', () => {
			const data = {}
			before((done) => {
				chai.request(app)
				.patch('/api/v1/articles/10001')
				.set({
					'Accept': 'application/json',
					"Authorization": `token: ${articleOwnerSecrets.data.token}`
				})
				.send({
					userId: articleOwnerSecrets.data.userId,
					isAdmin: articleOwnerSecrets.data.isAdmin,
					id: article.body.id,
                    authorId: article.body.authorId,
                    title: "Lorum Ipsium",
					article: "loriumIpsium Doloer"
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
				expect(data.body.data.message).to.eql('Article successfully updated')
            })
        })

        describe('title exceeds 100 characters', () => {
            const data = {}
            before((done) => {
                chai.request(app)
                .patch('/api/v1/articles/10001')
                .set({
                    'Accept': 'application/json',
                    "Authorization": `token: ${articleOwnerSecrets.data.token}`
                })
                .send({
                    userId: articleOwnerSecrets.data.userId,
					id: article.body.id,
                    authorId: article.body.authorId,                    
                    title: "Lorium Ipsium jhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhjk",
                    article: loriumIpsium
                })
                .end((error, response) => {
                    data.status = response.statusCode
                    data.body = response.body
                    done()
                })
            })
            it("should return 422 status code", () => {
                expect(data.status).to.equal(422)                
            })
            it("should return an error array", () => {
                expect(data.body.error).to.be.an('array')            
            })
        })
    
    })

    describe('user doesnt own article', () => {
        const userSecret = {}    
        const article = {}
        const data = {}
    
        before((done) => {
                //login, not article owner
                chai.request(app)
                .post('/api/v1/auth/signin')
                .set('Accept', 'application/json')
                .send({
                    email: "turan@gmail.com",
                    password: "password"
                })
                .end((error, response) => {
                    userSecret.data = response.body.data
                    //get article
                    chai.request(app)
                    .get('/api/v1/articles/10001')
                    .set({
                        'Accept': 'application/json',
                        "Authorization": `token: ${userSecret.data.token}`
                    })
                    .send({
                        userId: userSecret.data.userId,
                        isAdmin: userSecret.data.isAdmin,
                    })
                    .end((error, response) => {
                        article.body = response.body.data
                        done()
                    })
                })
            })

        before((done) => {
            chai.request(app)
            .patch('/api/v1/articles/10001')
            .set({
                'Accept': 'application/json',
                "Authorization": `token: ${userSecret.data.token}`
            })
            .send({
                userId: userSecret.data.userId,
                id: article.body.id,
                authorId: article.body.authorId,
                title: "Lorium Ipsium",
                article: loriumIpsium,
                isAdmin: userSecret.data.isAdmin
            })
            .end((error, response) => {
                data.status = response.statusCode
                data.body = response.body
                done()
            })
        })
        it("should return 401 status code", () => {
            expect(data.status).to.equal(401)
        })
        it("should return relevant error message", () => {
            expect(data.body.error).eql("Only admin or account owner can edit/delete this article, want to flag as inappropriate?")
        })        
    })


    describe('user is unauthorized', () => {
		const maliciousSecret = {token: "d@u30ur8038###(09@)(@(29299safosfshaj", userId: 10001, isAdmin: true}
        const data = {}
        before((done) => {
            chai.request(app)
            .patch('/api/v1/articles/10001')
            .set({
                'Accept': 'application/json',
                "Authorization": `token: ${maliciousSecret.token}`
            })
            .send({
                userId: maliciousSecret.userId,
                isAdmin: maliciousSecret.isAdmin,
                title: "Lorium Ipsium",
                article: loriumIpsium,
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
        it("should return relevant error message", () => {
            expect(data.body.error).eql("Unauthorized request")
        })        
    })
})