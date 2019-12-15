import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../app';

chai.use(chatHttp);
const { expect } = chai;

const loriumIpsium = 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.   At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.';


describe('create article', () => {
  describe('user is authorized', () => {
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

    describe('article more than 1000 words', () => {
      const data = {};
      before((done) => {
        chai.request(app)
          .post('/api/v1/articles')
          .set({
            Accept: 'application/json',
            Authorization: `token: ${adminSecrets.data.token} userId: ${adminSecrets.data.userId}`
          })
          .send({
            title: 'Lorium Ipsium',
            article: loriumIpsium,
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
      it('should return an error array ', () => {
        expect(data.body.error).to.be.an('array');
      });
    });

    describe('article or title empty', () => {
      const data = {};
      before((done) => {
        chai.request(app)
          .post('/api/v1/articles')
          .set({
            Accept: 'application/json',
            Accept: 'application/json',
            Authorization: `token: ${adminSecrets.data.token} userId: ${adminSecrets.data.userId}`
          })
          .send({
            title: '',
            article: loriumIpsium,
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
      it('should return an error array', () => {
        expect(data.body.error).to.be.an('array');
      });
    });

    describe('article and title formatted correctly', () => {
      const data = {};
      before((done) => {
        chai.request(app)
          .post('/api/v1/articles')
          .set({
            Accept: 'application/json',
            Accept: 'application/json',
            Authorization: `token: ${adminSecrets.data.token} userId: ${adminSecrets.data.userId}`
          })
          .send({
            title: 'Lorum Ipsium',
            article: 'loriumIpsium',
          })
          .end((error, response) => {
            data.status = response.statusCode;
            data.body = response.body;
            console.log('response.body article: ', response.body)
            done();
          });
      });
      it('should return 200 status code', () => {
        expect(data.status).to.equal(200);
      });
      it('should return relevant success message', () => {
        expect(data.body.data.message).to.eql('Article successfully posted');
      });
    });

    describe('title exceeds 100 characters', () => {
      const data = {};
      before((done) => {
        chai.request(app)
          .post('/api/v1/articles')
          .set({
            Accept: 'application/json',
            Authorization: `token: ${adminSecrets.data.token} userId: ${adminSecrets.data.userId}`
          })
          .send({
            title: 'Lorium Ipsium',
            article: loriumIpsium,
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
      it('should return an error array', () => {
        expect(data.body.error).to.be.an('array');
      });
    });
  });


  describe('user is unauthorized', () => {
    const maliciousSecret = { token: 'd@u30ur8038###(09@)(@(29299safosfshaj', userId: 10001, isAdmin: true };
    const data = {};
    before((done) => {
      chai.request(app)
        .post('/api/v1/articles')
        .set({
          Accept: 'application/json',
          Authorization: `token: ${maliciousSecret.token} userId: 100001`,
        })
        .send({
          title: 'Lorium Ipsium',
          article: loriumIpsium,
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
})
;