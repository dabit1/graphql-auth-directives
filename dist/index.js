"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IsAuthenticatedDirective = exports.HasRoleDirective = exports.HasScopeDirective = void 0;

var _errors = require("./errors");

var _http = require("http");

var jwt = _interopRequireWildcard(require("jsonwebtoken"));

var _graphqlTools = require("graphql-tools");

var _graphql = require("graphql");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

var verifyAndDecodeToken = function verifyAndDecodeToken(_ref) {
  var context = _ref.context;
  var req =
    context instanceof _http.IncomingMessage
      ? context
      : context.req || context.request;

  if (
    !req ||
    !req.headers ||
    (!req.headers.authorization && !req.headers.Authorization)
  ) {
    throw new _errors.AuthorizationError({
      message: "No authorization token."
    });
  }

  var token = req.headers.authorization || req.headers.Authorization;

  try {
    var id_token = token.replace("Bearer ", "");
    var JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error(
        "No JWT secret set. Set environment variable JWT_SECRET to decode token."
      );
    }

    var decoded = jwt.verify(id_token, JWT_SECRET, {
      algorithms: ["HS256", "RS256"]
    });
    return decoded;
  } catch (err) {
    throw new _errors.AuthorizationError({
      message: "You are not authorized for this resource"
    });
  }
};

var HasScopeDirective =
  /*#__PURE__*/
  (function(_SchemaDirectiveVisit) {
    _inherits(HasScopeDirective, _SchemaDirectiveVisit);

    function HasScopeDirective() {
      _classCallCheck(this, HasScopeDirective);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HasScopeDirective).apply(this, arguments)
      );
    }

    _createClass(
      HasScopeDirective,
      [
        {
          key: "visitFieldDefinition",
          // used for example, with Query and Mutation fields
          value: function visitFieldDefinition(field) {
            var expectedScopes = this.args.scopes;
            var next = field.resolve; // wrap resolver with auth check

            field.resolve = function(result, args, context, info) {
              var decoded = verifyAndDecodeToken({
                context: context
              }); // FIXME: override with env var

              var scopes =
                decoded["Scopes"] ||
                decoded["scopes"] ||
                decoded["Scope"] ||
                decoded["scope"] ||
                [];

              if (
                expectedScopes.some(function(scope) {
                  return scopes.indexOf(scope) !== -1;
                })
              ) {
                return next(
                  result,
                  args,
                  _objectSpread({}, context, {
                    user: decoded
                  }),
                  info
                );
              }

              throw new _errors.AuthorizationError({
                message: "You are not authorized for this resource"
              });
            };
          }
        },
        {
          key: "visitObject",
          value: function visitObject(obj) {
            var fields = obj.getFields();
            var expectedScopes = this.args.roles;
            Object.keys(fields).forEach(function(fieldName) {
              var field = fields[fieldName];
              var next = field.resolve;

              field.resolve = function(result, args, context, info) {
                var decoded = verifyAndDecodeToken({
                  context: context
                }); // FIXME: override w/ env var

                var scopes =
                  decoded["Scopes"] ||
                  decoded["scopes"] ||
                  decoded["Scope"] ||
                  decoded["scope"] ||
                  [];

                if (
                  expectedScopes.some(function(role) {
                    return scopes.indexOf(role) !== -1;
                  })
                ) {
                  return next(
                    result,
                    args,
                    _objectSpread({}, context, {
                      user: decoded
                    }),
                    info
                  );
                }

                throw new _errors.AuthorizationError({
                  message: "You are not authorized for this resource"
                });
              };
            });
          }
        }
      ],
      [
        {
          key: "getDirectiveDeclaration",
          value: function getDirectiveDeclaration(directiveName, schema) {
            return new _graphql.GraphQLDirective({
              name: "hasScope",
              locations: [
                _graphql.DirectiveLocation.FIELD_DEFINITION,
                _graphql.DirectiveLocation.OBJECT
              ],
              args: {
                scopes: {
                  type: new _graphql.GraphQLList(_graphql.GraphQLString),
                  defaultValue: "none:read"
                }
              }
            });
          }
        }
      ]
    );

    return HasScopeDirective;
  })(_graphqlTools.SchemaDirectiveVisitor);

exports.HasScopeDirective = HasScopeDirective;

var HasRoleDirective =
  /*#__PURE__*/
  (function(_SchemaDirectiveVisit2) {
    _inherits(HasRoleDirective, _SchemaDirectiveVisit2);

    function HasRoleDirective() {
      _classCallCheck(this, HasRoleDirective);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HasRoleDirective).apply(this, arguments)
      );
    }

    _createClass(
      HasRoleDirective,
      [
        {
          key: "visitFieldDefinition",
          value: function visitFieldDefinition(field) {
            var expectedRoles = this.args.roles;
            var next = field.resolve;

            field.resolve = function(result, args, context, info) {
              var decoded = verifyAndDecodeToken({
                context: context
              }); // FIXME: override with env var

              var roles = process.env.AUTH_DIRECTIVES_ROLE_KEY
                ? decoded[process.env.AUTH_DIRECTIVES_ROLE_KEY] || []
                : decoded["Roles"] ||
                  decoded["roles"] ||
                  decoded["Role"] ||
                  decoded["role"] ||
                  [];

              if (
                expectedRoles.some(function(role) {
                  return roles.indexOf(role) !== -1;
                })
              ) {
                return next(
                  result,
                  args,
                  _objectSpread({}, context, {
                    user: decoded
                  }),
                  info
                );
              }

              throw new _errors.AuthorizationError({
                message: "You are not authorized for this resource"
              });
            };
          }
        },
        {
          key: "visitObject",
          value: function visitObject(obj) {
            var fields = obj.getFields();
            var expectedRoles = this.args.roles;
            Object.keys(fields).forEach(function(fieldName) {
              var field = fields[fieldName];
              var next = field.resolve;

              field.resolve = function(result, args, context, info) {
                var decoded = verifyAndDecodeToken({
                  context: context
                });
                var roles = process.env.AUTH_DIRECTIVES_ROLE_KEY
                  ? decoded[process.env.AUTH_DIRECTIVES_ROLE_KEY] || []
                  : decoded["Roles"] ||
                    decoded["roles"] ||
                    decoded["Role"] ||
                    decoded["role"] ||
                    [];

                if (
                  expectedRoles.some(function(role) {
                    return roles.indexOf(role) !== -1;
                  })
                ) {
                  return next(
                    result,
                    args,
                    _objectSpread({}, context, {
                      user: decoded
                    }),
                    info
                  );
                }

                throw new _errors.AuthorizationError({
                  message: "You are not authorized for this resource"
                });
              };
            });
          }
        }
      ],
      [
        {
          key: "getDirectiveDeclaration",
          value: function getDirectiveDeclaration(directiveName, schema) {
            return new _graphql.GraphQLDirective({
              name: "hasRole",
              locations: [
                _graphql.DirectiveLocation.FIELD_DEFINITION,
                _graphql.DirectiveLocation.OBJECT
              ],
              args: {
                roles: {
                  type: new _graphql.GraphQLList(schema.getType("Role")),
                  defaultValue: "reader"
                }
              }
            });
          }
        }
      ]
    );

    return HasRoleDirective;
  })(_graphqlTools.SchemaDirectiveVisitor);

exports.HasRoleDirective = HasRoleDirective;

var IsAuthenticatedDirective =
  /*#__PURE__*/
  (function(_SchemaDirectiveVisit3) {
    _inherits(IsAuthenticatedDirective, _SchemaDirectiveVisit3);

    function IsAuthenticatedDirective() {
      _classCallCheck(this, IsAuthenticatedDirective);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(IsAuthenticatedDirective).apply(this, arguments)
      );
    }

    _createClass(
      IsAuthenticatedDirective,
      [
        {
          key: "visitObject",
          value: function visitObject(obj) {
            var fields = obj.getFields();
            Object.keys(fields).forEach(function(fieldName) {
              var field = fields[fieldName];
              var next = field.resolve;

              field.resolve = function(result, args, context, info) {
                var decoded = verifyAndDecodeToken({
                  context: context
                }); // will throw error if not valid signed jwt

                return next(
                  result,
                  args,
                  _objectSpread({}, context, {
                    user: decoded
                  }),
                  info
                );
              };
            });
          }
        },
        {
          key: "visitFieldDefinition",
          value: function visitFieldDefinition(field) {
            var next = field.resolve;

            field.resolve = function(result, args, context, info) {
              var decoded = verifyAndDecodeToken({
                context: context
              });
              return next(
                result,
                args,
                _objectSpread({}, context, {
                  user: decoded
                }),
                info
              );
            };
          }
        }
      ],
      [
        {
          key: "getDirectiveDeclaration",
          value: function getDirectiveDeclaration(directiveName, schema) {
            return new _graphql.GraphQLDirective({
              name: "isAuthenticated",
              locations: [
                _graphql.DirectiveLocation.FIELD_DEFINITION,
                _graphql.DirectiveLocation.OBJECT
              ]
            });
          }
        }
      ]
    );

    return IsAuthenticatedDirective;
  })(_graphqlTools.SchemaDirectiveVisitor);

exports.IsAuthenticatedDirective = IsAuthenticatedDirective;
