import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../app';
import testQueries from '../utilities/testQueryUtility';

chai.use(chatHttp);
const { expect } = chai;

testQueries.getMaxArticle()
  .then((response) => {
    const article = {};
    article.body = response;
    describe('flag article', () => {
      describe('user is authorized', () => {
        const authorizeduserSecret = {};
        const data = {};

        before((done) => {
          // login as article owner
          chai.request(app)
            .post('/api/v1/auth/signin')
            .set('Accept', 'application/json')
            .send({
              email: 'lovelace@gmail.com',
              password: 'password',
            })
            .end((error, response) => {
              authorizeduserSecret.data = response.body.data;
              done();
            });
        });
        before((done) => {
          chai.request(app)
            .patch(`/api/v1/articles/${article.body.id}/flag`)
            .set({
              Accept: 'application/json',
              Authorization: `token: ${authorizeduserSecret.data.token}`,
              userId: authorizeduserSecret.data.userId,
            })
            .send()
            .end((error, response) => {
              data.status = response.statusCode;
              data.body = response.body;
              done();
            });
        });
        it('should return 200 status code', () => {
          expect(data.status).to.equal(200);
        });
        it('should return relevant success message', () => {
          expect(data.body.data.message).to.eql('Article successfully flagged as inappropriate');
        });
      });

      describe('user is unauthorized', () => {
        const maliciousSecret = { token: 'd@u30ur8038###(09@)(@(29299safosfshaj', userId: 10001, isAdmin: true };
        const data = {};
        before((done) => {
          chai.request(app)
            .patch(`/api/v1/articles/${article.body.id}/flag`)
            .set({
              Accept: 'application/json',
              Authorization: `token: ${maliciousSecret.token}`,
              userId: 10001,
            })
            .send()
            .end((error, response) => {
              data.status = response.statusCode;
              data.body = response.body;
              done();
            });
        });
        it('should return 401 status code', () => {
          expect(data.status).to.equal(401);
        });
        it('should return relevant error message', () => {
          expect(data.body.error).eql('Unauthorized request');
        });
      });
    });
  })
  .catch((e) => {
    console.log('Test article query returnd no article, something wrong with create article test?');
    console.log(e);
    console.error('Test article query returnd no article, something wrong with create article test?');
  })
;