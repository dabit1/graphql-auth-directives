"use strict";

var _apolloErrors = require("apollo-errors");

var AuthorizationError = (0, _apolloErrors.createError)("AuthorizationError", {
  message: "You are not authorized."
});
module.exports = {
  AuthorizationError: AuthorizationError
};
