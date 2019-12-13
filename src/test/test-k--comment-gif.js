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
    describe('comment on gif', () => {
      describe('user is authorized', () => {
        const userSecret = {};
        const data = {};
        const comment = 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.   At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.';

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
              userSecret.data = response.body.data;
              done();
            });
        });


        describe('comment more than 800 characters', () => {
          before((done) => {
            chai.request(app)
              .post(`/api/v1/gifs/${gif.body.id}/comment`)
              .set({
                Accept: 'application/json',
                Authorization: `token: ${userSecret.data.token} userId: ${userSecret.data.userId}`,
              })
              .send({
                id: gif.body.id,
                comment,
              })
              .end((error, response) => {
                data.status = response.statusCode;
                data.body = response.body;
                done();
              });
          });
          it('should return 422 status code', () => {
            expect(data.status).to.equal(422);
          });
          it('should return relevant error message', () => {
            expect(data.body.error).to.be.an('array');
          });
        });

        describe('comment correctly formatted', () => {
          before((done) => {
            chai.request(app)
              .post(`/api/v1/gifs/${gif.body.id}/comment`)
              .set({
                Accept: 'application/json',
                Authorization: `token: ${userSecret.data.token} userId: ${userSecret.data.userId}`,
              })
              .send({
                id: gif.body.id,
                comment: 'awesome !',
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
          it('should return relevant error message', () => {
            expect(data.body.data.message).eql('comment successfully created');
          });
        });
      });

      describe('user is unauthorized', () => {
        const maliciousSecret = { token: 'd@u30ur8038###(09@)(@(29299safosfshaj' };
        const data = {};
        before((done) => {
          chai.request(app)
            .post(`/api/v1/gifs/${gif.body.id}/comment`)
            .set({
              Accept: 'application/json',
              Authorization: `token: ${maliciousSecret.token} userId: 10001`,
            })
            .send({
              id: gif.body.id,
              comment: 'awesome !',
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
    console.log('Test gif query returned no gif, something wrong with create gif test?');
    console.log(e);
    console.error('Test gif query returned no gif, something wrong with create gif test?');
  });
