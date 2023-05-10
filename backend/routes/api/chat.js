import _regeneratorRuntime from "babel-runtime/regenerator";

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import express from "express";
import { getChat, createChat, getMessages, addANewMessage, addANewPinnedMessage, getReactionWithUsername, removePinnedMessage, addANewReaction, updateReaction } from "../../dao/chat_dao";

var router = express.Router();

// create a new chat
router.post("/:id", function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res) {
		var id, dbChat;
		return _regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						id = req.params.id;
						_context.next = 3;
						return getChat(id);

					case 3:
						dbChat = _context.sent;

						if (dbChat) {
							_context.next = 7;
							break;
						}

						_context.next = 7;
						return createChat(id);

					case 7:

						res.sendStatus(201);

					case 8:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

// get all messages in the chat room
router.get("/all-messages/:id", function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res) {
		var id, messages;
		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						id = req.params.id;
						_context2.next = 3;
						return getMessages(id);

					case 3:
						messages = _context2.sent;

						res.status(200).json(messages);

					case 5:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, _this);
	}));

	return function (_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}());

// update message history
router.put("/new-message/:id", function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res) {
		var id, message, success;
		return _regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						id = req.params.id;
						message = req.body;
						_context3.next = 4;
						return addANewMessage(id, message);

					case 4:
						success = _context3.sent;


						res.sendStatus(success ? 204 : 404);

					case 6:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, _this);
	}));

	return function (_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}());

// update pinned message history
router.put("/pinned-messages/:id", function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res) {
		var id, pinnedMessage, success;
		return _regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						id = req.params.id;
						pinnedMessage = req.body;
						_context4.next = 4;
						return addANewPinnedMessage(id, pinnedMessage);

					case 4:
						success = _context4.sent;


						res.sendStatus(success ? 204 : 404);

					case 6:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee4, _this);
	}));

	return function (_x7, _x8) {
		return _ref4.apply(this, arguments);
	};
}());

// delete pinned message
router.put("/remove-pinned-message/:id", function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(req, res) {
		var id, pinnedMessage, success;
		return _regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						id = req.params.id;
						pinnedMessage = req.body;
						success = removePinnedMessage(id, pinnedMessage);


						res.sendStatus(success ? 204 : 404);

					case 4:
					case "end":
						return _context5.stop();
				}
			}
		}, _callee5, _this);
	}));

	return function (_x9, _x10) {
		return _ref5.apply(this, arguments);
	};
}());

// add a new or update the reaction
router.put("/new-reaction/:id", function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(req, res) {
		var id, _req$body, messageId, reaction, dbReaction, success;

		return _regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						id = req.params.id;
						_req$body = req.body, messageId = _req$body.messageId, reaction = _req$body.reaction;
						_context6.next = 4;
						return getReactionWithUsername(id, messageId, reaction);

					case 4:
						dbReaction = _context6.sent;
						success = {};

						if (dbReaction) {
							_context6.next = 12;
							break;
						}

						_context6.next = 9;
						return addANewReaction(id, messageId, reaction);

					case 9:
						success = _context6.sent;
						_context6.next = 15;
						break;

					case 12:
						_context6.next = 14;
						return updateReaction(id, messageId, reaction);

					case 14:
						success = _context6.sent;

					case 15:

						res.sendStatus(success ? 204 : 404);

					case 16:
					case "end":
						return _context6.stop();
				}
			}
		}, _callee6, _this);
	}));

	return function (_x11, _x12) {
		return _ref6.apply(this, arguments);
	};
}());

export default router;