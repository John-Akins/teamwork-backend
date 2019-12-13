import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import fs from 'fs'
import app from '../app'

chai.use(chatHttp);
const { expect } = chai;

describe('create gif', () => {
  describe('user is authorized', () => {
    const userSecret = {};
    before((done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Accept', 'application/json')
        .send({
          email: 'lovelace@gmail.com',
          password: 'password',
        })
        .end((error, response) => {
          userSecret.data = response.body.data;
          done();
        });
    });

    describe('properly formated request', () => {
      const res = {};
      before((done) => {
        const userData = userSecret.data;
        chai.request(app)
          .post('/api/v1/gifs')
          .set('Authorization', `token: ${userData.token} userId: ${userData.userId}`)
          .field('title', 'demo')
          .attach('image', fs.readFileSync(`${__dirname}//test-upload-image//Gif-008-T_large.gif`), `${__dirname}//test-upload-image//Gif-008-T_large.gif`)
          .end((error, response) => {
            console.log('response.body article: ', response.body)
            res.data = response.body.data;
            done();
          });
      });

      it('should return success status', () => {
        expect(res.data.status).to.equal('success');
      });
      it('should return success message', () => {
        expect(res.data).has.property('message').eql('GIF image successfully posted');
      });
      it('should return gif create date', () => {
        expect(res.data).has.property('createdOn');
      });
      it('should return gif title', () => {
        expect(res.data).has.property('title');
      });
      it('should return gif url', () => {
        expect(res.data).has.property('imageUrl');
      });
    });

    describe('title exceeds 100 characters', () => {
      const res = {};
      before((done) => {
        const userData = userSecret.data;
        chai.request(app)
          .post('/api/v1/gifs')
          .set('Authorization', `token: ${userData.token} userId: ${userData.userId}`)
          .field('title', 'deafsafsdafdsafsajdfjsahflkasdhfkjsahfkjhsdafkjhasdljfhsadkjhfsadhflkasdhfkjsadhfkjsadhfksdjsdkjhfskajddfldjsalkdjfhsadkljfjhdskfhsadkjlfhsdhfdsakjfdsjfhdskljhfasldkjsadlkjhfjkasdhkjdshfkljsdhdfkjhdskjlfhsakjldhfdskaljhfkldsajhsdkjlfhsaffdasfkasdkfnasdknfkasdnkdskfsaknfdasknfkdsnfkdsanknkfasdknfkdsakfdskfnsakksdnfksnamo')
          .attach('image', fs.readFileSync(`${__dirname}//test-upload-image//Gif-008-T_large.gif`), `${__dirname}//test-upload-image//Gif-008-T_large.gif`)
          .end((error, response) => {
            res.data = response.body;
            done();
          });
      });

      it('should prompt for file input', () => {
        expect(res.data).has.property('error').to.be.an('array');
      });
      it('should return error status', () => {
        expect(res.data.status).to.equal('error');
      });
    });

    describe('no image file uploaded', () => {
      const res = {};
      before((done) => {
        const userData = userSecret.data;
        chai.request(app)
          .post('/api/v1/gifs')
          .set('Authorization', `token: ${userData.token} userId: ${userData.userId}`)
          .field('title', 'demo')
          .end((error, response) => {
            res.data = response.body;
            done();
          });
      });

      it('should prompt for file input', () => {
        expect(res.data).has.property('error').eql('Please select a gif file to upload');
      });
      it('should return error status', () => {
        expect(res.data.status).to.equal('error');
      });
    });
  });

  describe('user is not authorized', () => {
    chai.request(app)
      .post('/api/v1/gifs')
      .set('Authorization', 'token: zckskdfnjadjid*w9wqnwkjqwjhwqjeiwqiqw8qw9halnjfd')
      .set('userId', 101010)
      .field('title', 'demo')
      .attach('image', fs.readFileSync(`${__dirname}//test-upload-image//Gif-008-T_large.gif`), `${__dirname}//test-upload-image//Gif-008-T_large.gif`)
      .end((response) => {
        it('should return 401 status code', () => {
          expect(response.body.status).to.equal(401);
        });
        it('should return relevant error message', () => {
          expect(response.body.error).eql('Unauthorized request');
        });
      });
  });
})
;