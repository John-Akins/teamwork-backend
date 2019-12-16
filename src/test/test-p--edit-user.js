import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import fs from 'fs';
import app from '../app';
import testQueries from '../utilities/testQueryUtility';

chai.use(chatHttp);
const { expect } = chai;

testQueries.createUser()
  .then((response) => {
    const user = {};
    user.userId = response;


    describe('edit user account', () => {
      describe('user is an admin', () => {
        const adminSecrets = {};
        before((done) => {
          chai.request(app)
            .post('/api/v1/auth/signin')
            .set('Accept', 'application/json')
            .send({
              email: 'lovelace@gmail.com',
              password: 'password',
            })
            .end((error, response) => {
              adminSecrets.data = response.body.data;
              done();
            });
        });

        describe('input existing email', () => {
          const data = {};
          before((done) => {
            chai.request(app)
              .patch(`/api/v1/users/${user.userId}`)
              .set('Authorization', `token: ${adminSecrets.data.token} userId: ${adminSecrets.data.userId}`)

              .field('firstName', 'akins')
              .field('lastName', 'akin')
              .field('email', 'turan@gmail.com')
              .field('address', 'akins street')
              .field('password', 'dfjdskjfsk')
              .field('gender', 'male')
              .field('jobRole', 'Engineer')
              .field('department', 'IT')
              .field('isAdmin', true)

              .attach('image', fs.readFileSync(`${__dirname}//test-upload-image//Gif-008-T_large.gif`), `${__dirname}//test-upload-image//Gif-008-T_large.gif`)
              .end((error, response) => {
                console.log('response.body: existing ', response.body);
                data.status = response.statusCode;
                data.body = response.body;
                done();
              });
          });

          it('should return 402 status code', () => {
            expect(data.status).to.equal(402);
          });
          it('should return relevant error message', () => {
            expect(data.body.error).eql('this email already exists');
          });
        });

        describe('empty field(s)/ wrong input format', () => {
          const data = {};
          before((done) => {
            chai.request(app)
              .patch(`/api/v1/users/${user.userId}`)
              .set('Authorization', `token: ${adminSecrets.data.token} userId: ${adminSecrets.data.userId}`)
              .field('firstName', 'a')
              .field('lastName', 'a')
              .field('email', 'a')
              .field('address', 'a')
              .field('password', 'a')
              .field('gender', 'a')
              .field('jobRole', 'a')
              .field('department', 'a')
              .field('isAdmin', true)
              .attach('image', fs.readFileSync(`${__dirname}//test-upload-image//Gif-008-T_large.gif`), `${__dirname}//test-upload-image//Gif-008-T_large.gif`)
              .end((error, response) => {
                data.status = response.statusCode;
                data.body = response.body;
                done();
              });
          });

          it('should return 422 status code', () => {
            expect(data.status).to.equal(422);
          });
          it('should return an error array', () => {
            expect(data.body.error).to.be.an('array');
          });
        });

        describe('input new user', () => {
          const data = {};
          const id = new Date().getTime();

          before((done) => {
            chai.request(app)
              .patch(`/api/v1/users/${user.userId}`)
              .set('Authorization', `token: ${adminSecrets.data.token} userId: ${adminSecrets.data.userId}`)

              .field('firstName', 'sola')
              .field('lastName', 'akin')
              .field('email', `${id}turana@gmail.com`)
              .field('address', 'akins street')
              .field('password', 'dfjdskjfsk')
              .field('gender', 'male')
              .field('jobRole', 'Engineer')
              .field('department', 'IT')
              .field('isAdmin', true)

              .attach('image', fs.readFileSync(`${__dirname}//test-upload-image//Gif-008-T_large.gif`), `${__dirname}//test-upload-image//Gif-008-T_large.gif`)

              .end((error, response) => {
                data.status = response.statusCode;
                data.body = response.body;
                done();
              });
          });

          it('should return 200 status code', () => {
            expect(data.status).to.equal(200);
          });
          it('should return relevant error message', () => {
            expect(data.body.data.message).eql('User account has been succesfully updated');
          });
        });

      });

      describe('user create employee', () => {
        const userSecret = {};

        before((done) => {
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

        describe('user not an admin', () => {
          const data = {};
          before((done) => {
            chai.request(app)
              .patch(`/api/v1/users/${user.userId}`)
              .set('Authorization', `token: ${userSecret.data.token} userId: ${userSecret.data.userId}`)
              .field('firstName', 'sola')
              .field('lastName', 'akin')
              .field('email', 'akins@gmail.com')
              .field('address', 'akins street')
              .field('password', 'dfjdskjfsk')
              .field('gender', 'male')
              .field('jobRole', 'Engineer')
              .field('department', 'IT')
              .field('isAdmin', true)
              .attach('image', fs.readFileSync(`${__dirname}//test-upload-image//Gif-008-T_large.gif`), `${__dirname}//test-upload-image//Gif-008-T_large.gif`)
              .end((error, response) => {
                data.status = response.statusCode;
                data.body = response.body;
                done();
              });
          });

          it('should return 401 status code', () => {
            expect(data.status).to.equal(401);
          });
          it('should return error relevant message', () => {
            expect(data.body.error).eql('Elevated access rights required');
          });
        });
      });
    });
  })
  .catch((e) => {
    console.log('Test user query returnd no user, something wrong with create user test?');
    console.log(e);
    console.error('Test user query returnd no user, something wrong with create user test?');
  });
