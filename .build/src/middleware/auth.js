"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var auth = {};

auth.allUsers = function (req, res, next) {
  try {
    var token = req.headers.authorization.split(" ")[1];

    var decodedToken = _jsonwebtoken["default"].verify(token, "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf");

    try {
      var userId = decodedToken.userId;

      if (req.body.userId && req.body.userId !== userId) {
        throw "Invalid user ID";
      } else {
        next();
      }
    } catch (e) {
      res.status(401).json({
        error: e
      });
    }
  } catch (e) {
    res.status(401).json({
      error: "Unauthorized request" + e
    });
  }
};

auth.adminOnly = function (req, res, next) {
  try {
    var token = req.headers.authorization.split(" ")[1];

    var decodedToken = _jsonwebtoken["default"].verify(token, "$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf");

    var userId = decodedToken.userId,
        isAdmin = decodedToken.isAdmin;

    try {
      if (req.body.userId && req.body.userId !== userId) {
        throw "Invalid user ID";
      }

      if (isAdmin !== true) {
        throw "Elevated access rights required";
      } else {
        next();
      }
    } catch (e) {
      res.status(401).json({
        error: e
      });
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({
      error: "Unauthorized request"
    });
  }
};

var _default = auth;
exports["default"] = _default;
//# sourceMappingURL=auth.js.map