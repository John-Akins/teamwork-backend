import chai from 'chai'
import chatHttp from 'chai-http'
import 'chai/register-should'
import app from '../app'
import testQueries from '../utilities/testQueryUtility'

chai.use(chatHttp)
const { expect } = chai

testQueries.getMaxArticle()
    .then((response) => {
        console.log("response ::::::: c")
        console.log(response)
        const article = {}
        article.body = response    
        describe('comment on article', () => {
            describe('user is authorized', () => {
                const userSecrets = {}
                const data = {}
                const comment = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.   At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                
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
                        userSecrets.data = response.body.data
                        done()
                    })
                })


                describe('comment more than 800 characters', () => {                            
                    before((done) => {
                        chai.request(app)
                        .delete(`/api/v1/articles/${article.body.id}/comment`)
                        .set({
                            'Accept': 'application/json',
                            "Authorization": `token: ${userSecrets.data.token}`
                        })
                        .send({
                            userId: userSecrets.data.userId,
                            id: article.body.id,
                            comment: comment
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
                        expect(data.body.error).eql("maximum characer exceeded for comment, maximum of 800 characters allowed")
                    })        
                })

                describe('comment correctly formatted', () => {
                            
                    before((done) => {
                            chai.request(app)
                            .delete(`/api/v1/articles/${article.body.id}/comment`)
                            .set({
                                'Accept': 'application/json',
                                "Authorization": `token: ${userSecrets.data.token}`
                            })
                            .send({
                                userId: userSecrets.data.userId,
                                id: article.body.id,
                                comment: "awesome !"
                            })
                            .end((error, response) => {
                                data.status = response.statusCode
                                data.body = response.body
                                done()
                            })
                        })
                        it("should return 200 status code", () => {
                            expect(data.status).to.equal(401)
                        })
                        it("should return relevant error message", () => {
                            expect(data.body.data.message).eql("comment posted succesfully")
                        })        
                })
            })

            describe('user is unauthorized', () => {
                const maliciousSecret = {token: "d@u30ur8038###(09@)(@(29299safosfshaj", userId: 10001, isAdmin: true}
                const data = {}
                before((done) => {
                    chai.request(app)
                    .delete(`/api/v1/articles/${article.body.id}/comment`)
                    .set({
                        'Accept': 'application/json',
                        "Authorization": `token: ${maliciousSecret.token}`
                    })
                    .send({
                        userId: maliciousSecret.userId,
                        id: article.body.id,
                        comment: "awesome !"
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
    })
    .catch((e) => {
        console.log("Test article query returned no article, something wrong with create article test?")
        console.log(e)
        console.error("Test article query returned no article, something wrong with create article test?")
    })
