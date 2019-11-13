"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

require("chai/register-should");

var _app = _interopRequireDefault(require("../../app"));

_chai["default"].use(_chaiHttp["default"]);

var expect = _chai["default"].expect;
describe("admin or employee sign in", function () {
  describe("incorrect email and/or password", function () {
    var data = {};
    before(function (done) {
      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').set('Accept', 'application/json').send({
        email: "mail@email.com",
        password: "password"
      }).end(function (error, response) {
        data.status = response.statusCode;
        data.body = response.body;
        done();
      });
    });
    it("should return 401 status code", function () {
      expect(data.status).to.equal(401);
    });
    it("should return relevant error message", function () {
      expect(data.body.error).to.equal("incorrect email or password");
    });
  });
  describe("correct email and password", function () {
    var data = {};
    before(function (done) {
      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').set('Accept', 'application/json').send({
        email: "lovelace@gmail.com",
        password: "password"
      }).end(function (error, response) {
        data.status = response.statusCode;
        data.body = response.body;
        done();
      });
    });
    it("should return 200 status code", function () {
      expect(data.status).to.equal(200);
    });
    it("should return user Id", function () {
      expect(data.body.data.userId).eql('10001');
    });
  });
});
//# sourceMappingURL=signin.js.map