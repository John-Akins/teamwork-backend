import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../app';

chai.use(chatHttp);
const { expect } = chai;

describe('admin or employee sign in', () => {
  describe('incorrect email and/or password', () => {
    const data = {};
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'mail@email.com',
          password: 'password',
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
      expect(data.body.error).to.equal('incorrect email or password');
    });
  });
  describe('correct email and password', () => {
    const data = {};
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'lovelace@gmail.com',
          password: 'password',
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
    it('should return user Id', () => {
      expect(data.body.data.userId).eql('10001');
    });
  });
})
;