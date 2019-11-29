import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../app';
import testQueries from '../utilities/testQueryUtility';

chai.use(chatHttp);
const { expect } = chai;

testQueries.commentOnArticle()
  .then((commentId) => {
    describe('flag article comment', () => {
      describe('user is authorized', () => {
        const authorizeduserSecret = {};

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

        describe('comment does not exist', () => {
          const data = {};
          before((done) => {
            chai.request(app)
              .patch('/api/v1/articles/comments/10003/flag')
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
          it('should return 401 status code', () => {
            expect(data.status).to.equal(401);
          });
          it('should return relevant error message', () => {
            expect(data.body.error).to.eql('Oopsy, comment cannot be found');
          });
        });

        describe('commentId exceeds 50 characters', () => {
          const data = {};
          before((done) => {
            chai.request(app)
              .patch('/api/v1/articles/comments/10009222222222222222222222100000000000000000000000000000000000000029999999999999999999999999999999999993333333333333333333444444444444444444444444444444444444444443/flag')
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
          it('should return 422 status code', () => {
            expect(data.status).to.equal(422);
          });
          it('should return an array error message', () => {
            expect(data.body.error).to.be.an('array');
          });
        });

        describe('comment exists', () => {
          const data = {};
          before((done) => {
            chai.request(app)
              .patch(`/api/v1/articles/comments/${commentId}/flag`)
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
            expect(data.body.data.message).to.eql('Comment successfully flagged as inappropriate');
          });
        });
      });

      describe('user is unauthorized', () => {
        const maliciousSecret = { token: 'd@u30ur8038###(09@)(@(29299safosfshaj', userId: 10001, isAdmin: true };
        const data = {};
        before((done) => {
          chai.request(app)
            .patch(`/api/v1/articles/comments/${commentId}/flag`)
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
    console.log('Test article comment query returnd no article, something wrong with create article test?');
    console.log(e);
    console.error('Test article comment query returnd no article, something wrong with create article test?');
  })
;