"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

require("chai/register-should");

var _app = _interopRequireDefault(require("../../app"));

_chai["default"].use(_chaiHttp["default"]);

var expect = _chai["default"].expect;
describe("create user", function () {
  describe("admin create employee", function () {
    var adminSecrets = {};
    before(function (done) {
      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').set('Accept', 'application/json').send({
        email: "lovelace@gmail.com",
        password: "password"
      }).end(function (error, response) {
        adminSecrets.data = response.body.data;
        done();
      });
    });
    describe("input existing email", function () {
      var data = {};
      before(function (done) {
        _chai["default"].request(_app["default"]).post('/api/v1/auth/create-user').set({
          'Accept': 'application/json',
          "Authorization": "token: ".concat(adminSecrets.data.token)
        }).send({
          userId: adminSecrets.data.userId,
          firstName: "akins",
          lastName: "akin",
          email: "turan@gmail.com",
          address: "akins street",
          password: "dfjdskjfsk",
          gender: "male",
          jobRole: "Engineer",
          department: "IT",
          isAdmin: true
        }).end(function (error, response) {
          data.status = response.statusCode;
          data.body = response.body;
          done();
        });
      });
      it("should return 402 status code", function () {
        expect(data.status).to.equal(402);
      });
      it("should return relevant error message", function () {
        expect(data.body.error).eql("this email already exists");
      });
    });
    describe("empty field(s)/ wrong input format", function () {
      var data = {};
      before(function (done) {
        _chai["default"].request(_app["default"]).post('/api/v1/auth/create-user').set({
          'Accept': 'application/json',
          "Authorization": "token: ".concat(adminSecrets.data.token)
        }).send({
          userId: adminSecrets.data.userId,
          firstName: "",
          lastName: "",
          email: "",
          address: "",
          password: "",
          gender: "",
          jobRole: "",
          department: "",
          isAdmin: false
        }).end(function (error, response) {
          data.status = response.statusCode;
          data.body = response.body;
          done();
        });
      });
      it("should return 422 status code", function () {
        expect(data.status).to.equal(422);
      });
      it("should return an error array", function () {
        expect(data.body.error).to.be.an('array');
      });
    });
  });
  describe("user create employee", function () {
    var userSecrets = {};
    before(function (done) {
      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').set('Accept', 'application/json').send({
        email: "turan@gmail.com",
        password: "password"
      }).end(function (error, response) {
        userSecrets.data = response.body.data;
        done();
      });
    });
    describe("user not an admin", function () {
      var data = {};
      before(function (done) {
        _chai["default"].request(_app["default"]).post('/api/v1/auth/create-user').set({
          'Accept': 'application/json',
          "Authorization": "token: ".concat(userSecrets.data.token)
        }).send({
          userId: userSecrets.data.userId,
          firstName: "sola",
          lastName: "akin",
          email: "akins@gmail.com",
          address: "akins street",
          password: "dfjdskjfsk",
          gender: "male",
          jobRole: "Engineer",
          department: "IT",
          isAdmin: false
        }).end(function (error, response) {
          data.status = response.statusCode;
          data.body = response.body;
          done();
        });
      });
      it("should return 401 status code", function () {
        expect(data.status).to.equal(401);
      });
      it("should return error relevant message", function () {
        expect(data.body.error).eql("Elevated access rights required");
      });
    });
  });
});
//# sourceMappingURL=create-user.js.map