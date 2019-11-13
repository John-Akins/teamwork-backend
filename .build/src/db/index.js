"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

var _config = _interopRequireDefault(require("../config/config"));

var env = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV.trim();
var _configJson$env = _config["default"][env],
    database = _configJson$env.database,
    username = _configJson$env.username,
    password = _configJson$env.password,
    host = _configJson$env.host;
var connectionString = "postgressql://".concat(username, ":").concat(password, "@").concat(host, ":5432/").concat(database);
var pool = new _pg.Pool({
  connectionString: connectionString
}); // the pool will emit an error on behalf of any idle clients it contains
// if a backend error or network partition happens

pool.on('error', function (err) {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
var db = {};

db.query = function (queryString) {
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        reject({
          error: 'QueryError' + err.stack
        });
      }

      client.query(queryString, function (err, result) {
        //call `done()` to release the client back to the pool
        done();

        if (err) {
          reject({
            error: 'QueryError' + err.stack
          });
        }

        resolve(result);
      });
    });
  });
};

db.queryAll = function (queryString) {
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        reject({
          error: 'QueryError' + err.stack
        });
      }

      client.query(queryString, function (err, result) {
        //call `done()` to release the client back to the pool
        done();

        if (err) {
          reject({
            error: 'QueryError' + err.stack
          });
        }

        resolve(result.rows);
      });
    });
  });
};

db.queryWhere = function (query) {
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        reject({
          error: 'QueryError' + err.stack
        });
      }

      client.query(query, function (err, result) {
        done();

        if (err) {
          reject({
            error: 'QueryError' + err.stack
          });
        }

        resolve(result.rows);
      });
    });
  });
};

var _default = db;
exports["default"] = _default;
//# sourceMappingURL=index.js.map