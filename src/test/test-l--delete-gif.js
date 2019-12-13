import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../app';
import testQueries from '../utilities/testQueryUtility';

chai.use(chatHttp);
const { expect } = chai;

testQueries.getMaxGif()
  .then((response) => {
    const gif = {};
    gif.body = response;
    describe('delete gif', () => {
      describe('user owns gif', () => {
        const gifOwnerSecrets = {};
        const data = {};

        before((done) => {
          // login as gif owner
          chai.request(app)
            .post('/api/v1/auth/signin')
            .set('Accept', 'application/json')
            .send({
              email: 'lovelace@gmail.com',
              password: 'password',
            })
            .end((error, response) => {
              gifOwnerSecrets.data = response.body.data;
              done();
            });
        });
        before((done) => {
          chai.request(app)
            .delete(`/api/v1/gifs/${gif.body.id}`)
            .set({
              Accept: 'application/json',
              Authorization: `token: ${gifOwnerSecrets.data.token} userId: ${gifOwnerSecrets.data.userId}`,
            })
            .send({
              id: gif.body.id,
              authorId: gif.body.authorId,
            })
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
          expect(data.body.data.message).to.eql('Gif successfully deleted');
        });
      });
      describe('user doesnt own gif', () => {
        const userSecret = {};
        const data = {};

        before((done) => {
          // login, not gif owner
          chai.request(app)
            .post('/api/v1/auth/signin')
            .set('Accept', 'application/json')
            .send({
              email: 'turan@gmail.com',
              password: 'password',
            })
            .end((error, response) => {
              userSecret.data = response.body.data;
              done();
            });
        });

        before((done) => {
          chai.request(app)
            .delete(`/api/v1/gifs/${gif.body.id}`)
            .set({
              Accept: 'application/json',
              Authorization: `token: ${userSecret.data.token} userId: ${userSecret.data.userId}`,
            })
            .send({
              id: gif.body.id,
              authorId: gif.body.authorId,
            })
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
          expect(data.body.error).eql('Only admin or account owner can edit/delete this feed, want to flag as inappropriate?');
        });
      });
      describe('user is unauthorized', () => {
        const maliciousSecret = { token: 'd@u30ur8038###(09@)(@(29299safosfshaj' };
        const data = {};
        before((done) => {
          chai.request(app)
            .delete(`/api/v1/gifs/${gif.body.id}`)
            .set({
              Accept: 'application/json',
              Authorization: `token: ${maliciousSecret.token} userId: 100001`,
            })
            .send({
              isAdmin: maliciousSecret.isAdmin,
            })
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
    console.log('Test gif query returnd no gif, something wrong with create gif test?');
    console.log(e);
    console.error('Test gif query returnd no gif, something wrong with create gif test?');
  });
