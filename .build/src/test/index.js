"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chai = _interopRequireDefault(require("chai"));

require("chai/register-should");

var _migrations = _interopRequireDefault(require("../migrations"));

var expect = _chai["default"].expect;
describe('Database Migrations', function () {
  describe('Schema Migrations', function () {
    var data = {};
    before(function (done) {
      data.response = _migrations["default"].createTablesIfNotExists();
      done();
    });
    it("should reply with true on success", function (done) {
      expect(data.response).to.equal(true);
      done();
    });
  });
  describe('Fill test data', function () {
    var data = {};
    before(function (done) {
      data.response = _migrations["default"].fillDummyData();
      done();
    });
    it("should return true on success", function (done) {
      expect(data.response).to.equal(true);
      done();
    });
  });
});
//# sourceMappingURL=index.js.map