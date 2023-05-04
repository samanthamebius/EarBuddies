import _regeneratorRuntime from "babel-runtime/regenerator";

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import express from "express";
import { getUser, getUserbyId, deleteUser, updateUserInfo, searchActiveStudios, searchStudioUsers, searchStudios, searchUsers } from "../../dao/user_dao";

var router = express.Router();

router.get("/users/:username/:query", function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res) {
    var _req$params, username, query, users;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$params = req.params, username = _req$params.username, query = _req$params.query;
            _context.prev = 1;
            _context.next = 4;
            return searchUsers(query, username);

          case 4:
            users = _context.sent;

            res.json(users);
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);

            res.status(500).json(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, _this, [[1, 8]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

router.get("/users/:username/:query/:studioId", function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$params2, username, query, studioId, users;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$params2 = req.params, username = _req$params2.username, query = _req$params2.query, studioId = _req$params2.studioId;
            _context2.prev = 1;
            _context2.next = 4;
            return searchStudioUsers(studioId, query, username);

          case 4:
            users = _context2.sent;

            res.json(users);
            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);

            res.status(500).json(_context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, _this, [[1, 8]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

router.get("/:id", function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res) {
    var id, user;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;

            if (id) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({ msg: "No user id provided" }));

          case 3:
            _context3.prev = 3;
            _context3.next = 6;
            return getUser(id);

          case 6:
            user = _context3.sent;

            if (user) {
              _context3.next = 11;
              break;
            }

            _context3.next = 10;
            return getUserbyId(id);

          case 10:
            user = _context3.sent;

          case 11:
            res.json(user);
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](3);

            res.status(500).json(_context3.t0);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, _this, [[3, 14]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

router.get("/:username/studios/:query", function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$params3, username, query, studios;

    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$params3 = req.params, username = _req$params3.username, query = _req$params3.query;

            if (username) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return", res.status(400).json({ msg: "No username provided" }));

          case 3:
            _context4.prev = 3;
            _context4.next = 6;
            return searchStudios(username, query);

          case 6:
            studios = _context4.sent;

            res.json(studios);
            _context4.next = 13;
            break;

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](3);

            res.status(500).json(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, _this, [[3, 10]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

router.get("/:username/active/:query", function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(req, res) {
    var _req$params4, username, query, studios;

    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$params4 = req.params, username = _req$params4.username, query = _req$params4.query;

            if (username) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return", res.status(400).json({ msg: "No username provided" }));

          case 3:
            _context5.prev = 3;
            _context5.next = 6;
            return searchActiveStudios(username, query);

          case 6:
            studios = _context5.sent;

            res.json(studios);
            _context5.next = 13;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](3);

            res.status(500).json(_context5.t0);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, _this, [[3, 10]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());

router.put("/:id", function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(req, res) {
    var id;
    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;

            if (id) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", res.status(400).json({ msg: "No user id provided" }));

          case 3:
            _context6.prev = 3;
            _context6.next = 6;
            return updateUserInfo(id, req.body.userDisplayName, req.body.spotifyPic, req.body.profilePic);

          case 6:
            res.status(204).json({ msg: "User updated" });
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](3);

            res.status(500).json(_context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, _this, [[3, 9]]);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());

router.delete("/:id", function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(req, res) {
    var id;
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;

            if (id) {
              _context7.next = 3;
              break;
            }

            return _context7.abrupt("return", res.status(400).json({ msg: "No user id provided" }));

          case 3:
            _context7.prev = 3;
            _context7.next = 6;
            return deleteUser(id);

          case 6:
            res.status(204).json({ msg: "User deleted" });
            _context7.next = 12;
            break;

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](3);

            res.status(500).json(_context7.t0);

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, _this, [[3, 9]]);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());

export default router;