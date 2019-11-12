"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _expressValidator = require("express-validator");

var _db = _interopRequireDefault(require("../db"));

var authController = {};

authController.signin = function (req, res) {
  // Get input validation status
  var errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()
    });
  }

  var userEmail = req.body.email;
  var userPassword = req.body.password;
  var query = {
    name: "fetch-user",
    text: "SELECT * FROM users WHERE email = $1",
    values: [userEmail]
  };

  _db["default"].queryWhere(query).then(function (user) {
    if (user[0] === undefined) {
      return res.status(401).json({
        status: "error",
        error: "incorrect email or password"
      });
    } else {
      var userId = user[0].userId;
      var isAdmin = user[0].isAdmin;

      _bcrypt["default"].compare(userPassword, user[0].password).then(function (valid) {
        if (!valid) {
          return res.status(401).json({
            status: "error",
            error: "incorrect email or password"
          });
        }

        var token = _jsonwebtoken["default"].sign({
          userId: userId,
          isAdmin: isAdmin
        }, "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf", {
          expiresIn: "24h"
        });

        res.status(200).json({
          status: "success",
          data: {
            token: token,
            userId: user[0].userId,
            jobRole: user[0].jobRole
          }
        });
      })["catch"](function (error) {
        res.status(401).json({
          status: "error",
          error: "incorrect email or password"
        });
      });
    }
  })["catch"](function (error) {
    res.status(403).json({
      status: "error",
      error: "server error"
    });
  });
};

var emailExists = function emailExists(email) {
  return new Promise(function (resolve, reject) {
    var query = {
      // give the query a unique name
      name: "fetch-user",
      text: "SELECT * FROM users WHERE email = $1",
      values: [email]
    };

    _db["default"].queryWhere(query).then(function (user) {
      if (user[0] !== undefined) {
        resolve(true);
      }

      resolve(false);
    })["catch"](function (error) {
      reject({
        status: "error",
        error: "could not perform request"
      });
    });
  });
};

authController.createUser = function (req, res) {
  var errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()
    });
  }

  var _req$body = req.body,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName,
      email = _req$body.email,
      address = _req$body.address,
      password = _req$body.password,
      gender = _req$body.gender,
      jobRole = _req$body.jobRole,
      department = _req$body.department,
      isAdmin = _req$body.isAdmin;
  emailExists(email).then(function (isDuplicate) {
    if (isDuplicate === true) {
      return res.status(402).json({
        status: "error",
        error: "this email already exists"
      });
    } else {
      var userId = new Date().getTime();
      var token = !req.headers.authorization ? "" : req.headers.authorization.split()[1];

      _bcrypt["default"].hash(password, 10).then(function (hash) {
        var query = {
          name: "create-user",
          text: "INSERT INTO users(\"userId\", \"firstName\", \"lastName\", \"email\", \"address\", \"password\", \"gender\", \"jobRole\", \"department\", \"isAdmin\", \"isNewAccount\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          values: [userId, firstName, lastName, email, address, hash, gender, jobRole, department, isAdmin, true]
        };

        _db["default"].queryWhere(query).then(function () {
          res.status(200).json({
            status: "success",
            data: {
              message: "User account successfully created",
              token: token,
              userId: userId,
              jobRole: jobRole
            }
          });
        })["catch"](function (error) {
          res.status(500).json({
            status: "error",
            error: "Internal server error " + error
          });
        });
      })["catch"](function (error) {
        res.status(500).json({
          status: "error",
          error: error
        });
      });
    }
  })["catch"](function (error) {
    res.status(500).json({
      status: "error",
      error: error
    });
  });
};

var _default = authController;
exports["default"] = _default;
//# sourceMappingURL=auth.js.map