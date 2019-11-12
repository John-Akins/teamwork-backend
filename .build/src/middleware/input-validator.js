"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _require = require("express-validator"),
    body = _require.body,
    sanitizeBody = _require.sanitizeBody;

var inputValidator = {};
inputValidator.signin = [body("email", "please enter a valid email").not().isEmpty().isEmail(), body("password", "minimum of 8 characters required").not().isEmpty().isLength({
  min: 8
}), sanitizeBody("email").trim().escape(), sanitizeBody("password").trim().escape()];
inputValidator.createUser = [body("firstName").not().isEmpty().isLength({
  min: 2
}), body("lastName").not().isEmpty().isLength({
  min: 2
}), body("email").not().isEmpty().isEmail().isLength({
  min: 8
}), body("address").not().isEmpty().isLength({
  min: 10
}), body("gender").not().isEmpty().isLength({
  min: 4
}), body("jobRole").not().isEmpty().isLength({
  min: 2
}), body("department").not().isEmpty().isLength({
  min: 2
}), body("password").not().isEmpty().isLength({
  min: 8
}), body("isAdmin").not().isEmpty().isBoolean(), sanitizeBody("firstName").trim().escape(), sanitizeBody("lastName").trim().escape(), sanitizeBody("email").trim().escape(), sanitizeBody("address").trim().escape(), sanitizeBody("gender").trim().escape(), sanitizeBody("jobRole").trim().escape(), sanitizeBody("department").trim().escape(), sanitizeBody("password").trim().escape(), sanitizeBody("isAdmin").toBoolean()];
var _default = inputValidator;
exports["default"] = _default;
//# sourceMappingURL=input-validator.js.map