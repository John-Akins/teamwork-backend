"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../db"));

var dbMigration = {};

dbMigration.tableExists = function (table) {
  return new Promise(function (resolve, reject) {
    var query = "SELECT * FROM ".concat(table);

    _db["default"].query(query).then(function () {
      resolve(true);
    })["catch"](function (error) {
      reject(false);
    });
  });
};

dbMigration.tablesAndQueries = [{
  table: "users",
  query: 'CREATE TABLE users ( "userId" bigint NOT NULL, "firstName" character varying(30) NOT NULL, "lastName" character varying NOT NULL, email character varying NOT NULL, address character varying NOT NULL, password character varying NOT NULL, gender character varying NOT NULL, "jobRole" character varying NOT NULL, department character varying NOT NULL, "isAdmin" boolean NOT NULL, "isNewAccount" boolean DEFAULT true NOT NULL )'
}, {
  table: "articles",
  query: 'CREATE TABLE articles ( title character(100) NOT NULL, "articleId" bigint NOT NULL, "createdOn" date NOT NULL, "createdBy" character varying(20) NOT NULL, article character(1000) NOT NULL )'
}, {
  table: "feedComments",
  query: 'CREATE TABLE feedComments ( "feedId" bigint NOT NULL, "commentId" bigint NOT NULL, "feedType" character(20) NOT NULL, comment character(500) NOT NULL, "commentOn" date NOT NULL, "commentBy" bigint NOT NULL, "isFlagged" boolean )'
}, {
  table: "feedFlags",
  query: 'CREATE TABLE feedFlags ( "flagId" bigint NOT NULL, "feedId" bigint NOT NULL, "feedType" character(20) NOT NULL, "flaggedOn" date, "flaggedBy" character(20) )'
}, {
  table: "gifs",
  query: 'CREATE TABLE gifs ( "gifId" bigint NOT NULL, title character(100) NOT NULL, "imageUrl" character(100) NOT NULL, "createdOn" date NOT NULL, "createdBy" character(20)[] NOT NULL )'
}];
dbMigration.hasCreatedTables = false;

dbMigration.createTablesIfNotExists = function () {
  var tablesAndQueries = dbMigration.tablesAndQueries;

  var _loop = function _loop(i) {
    dbMigration.hasCreatedTables = i === 0 ? true : dbMigration.hasCreatedTables;
    var table = tablesAndQueries[i].table;
    var tableQuery = tablesAndQueries[i].query; // check if table exists

    dbMigration.tableExists(table).then(function (res) {
      dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && res;
    })["catch"](function (error) {
      _db["default"].query(tableQuery).then(function () {
        dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && true;
      })["catch"](function () {
        dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && error;
      });
    });
  };

  for (var i = 0; i < tablesAndQueries.length; i++) {
    _loop(i);
  }

  return dbMigration.hasCreatedTables;
};

dbMigration.dummyQueries = [{
  table: "articles",
  query: "INSERT INTO articles (title, articleId, createdOn, createdBy, article) values ('Old lady tale', 10001, '2019-10-12', 10001, 'One nice Old Lady Tale '),('Quick brown fox', 10002, '2019-11-12',10002, 'One Hell of a quick brown fox'), ('Ada Lovelace', 10003, '2019-10-12',	10002, 'A computer science fairy tale')"
}, {
  table: "feedComments",
  query: "INSERT INTO  feedComments (feedId, commentId, feedType, comment, commentOn, commentBy, isFlagged) values (10001, 10001,'article', 'Very nice', '2019-10-10', 10001, f), (10002, 10002,	'article', 'Very nice', '2019-10-10', 10001, f)"
}, {
  table: "users",
  query: "INSERT INTO  users (userId, firstName, lastName, email, address, password, gender, jobRole, department, isAdmin, isNewAccount) values (10001, 'Ada Lovelace', 'lovelace@gmail.com', 'LOvelace street', '$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa', 'female',	'Software Engineer', 'IT',	t,	f), (10002,	'Ada Turan', 'turan@gmail.com', 'Turan street', '$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa',	'male',	'Software Engineer', 'IT',	f,	f)"
}];
dbMigration.dummyQueriesExecuted = false;

dbMigration.fillDummyData = function () {
  var dummyQueries = dbMigration.dummyQueries;
  var len = dummyQueries.length;

  for (var i = 0; i < len; i++) {
    dbMigration.hasCreatedTables = i === 0 ? true : dbMigration.hasCreatedTables;

    _db["default"].query(dummyQueries[i]).then(function (response) {
      dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && true;
    })["catch"](function (error) {
      dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && false;
    });
  }

  return dbMigration.hasCreatedTables;
};

var _default = dbMigration;
exports["default"] = _default;
//# sourceMappingURL=index.js.map