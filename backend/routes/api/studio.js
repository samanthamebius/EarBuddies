import _regeneratorRuntime from "babel-runtime/regenerator";

var _this2 = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import express from "express";
import fs from "fs";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { createStudio, getStudio, deleteStudio, updateStudioUsers, updateStudioControlHostOnly } from "../../dao/studio_dao.js";
import { getUserId, getStudiosId, updateStudios, getUsername, updateStudiosUsername } from "../../dao/user_dao.js";
import { getSpotifyApi } from "../../dao/spotify_dao.js";

var router = express.Router();

var upload = multer({
	dest: "./uploads"
});

//create studio
router.post("/new", function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res) {
		var _req$body, name, listeners, host_name, genres, coverPhoto, isHostOnly, playlist_name, api;

		return _regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.prev = 0;
						_req$body = req.body, name = _req$body.name, listeners = _req$body.listeners, host_name = _req$body.host, genres = _req$body.genres, coverPhoto = _req$body.studioBannerImageUrl, isHostOnly = _req$body.isHostOnly;

						//create studio playlist

						playlist_name = "Earbuddies - " + name;
						api = getSpotifyApi();

						if (api) {
							_context3.next = 7;
							break;
						}

						console.log("No Spotify API connection");
						return _context3.abrupt("return", res.status(403).json({ msg: "No Spotify API connection" }));

					case 7:
						api.createPlaylist(playlist_name, { 'public': true }).then(function () {
							var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(data) {
								var _this = this;

								var playlist_id, newStudio;
								return _regeneratorRuntime.wrap(function _callee2$(_context2) {
									while (1) {
										switch (_context2.prev = _context2.next) {
											case 0:
												playlist_id = data.body.id;

												// Create the new studio

												_context2.next = 3;
												return createStudio(name, listeners, host_name, genres, coverPhoto, isHostOnly, playlist_id);

											case 3:
												newStudio = _context2.sent;

												//add studios to user
												listeners.forEach(function () {
													var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(listener) {
														var studios;
														return _regeneratorRuntime.wrap(function _callee$(_context) {
															while (1) {
																switch (_context.prev = _context.next) {
																	case 0:
																		_context.next = 2;
																		return getStudiosId(listener);

																	case 2:
																		studios = _context.sent;

																		studios.push(newStudio._id);
																		updateStudiosUsername(listener, studios);

																	case 5:
																	case "end":
																		return _context.stop();
																}
															}
														}, _callee, _this);
													}));

													return function (_x4) {
														return _ref3.apply(this, arguments);
													};
												}());
												// Respond with the newly created studio
												res.status(201).location("/api/studio/" + newStudio._id).json(newStudio);

											case 6:
											case "end":
												return _context2.stop();
										}
									}
								}, _callee2, this);
							}));

							return function (_x3) {
								return _ref2.apply(this, arguments);
							};
						}(), function (err) {
							console.log('Something went wrong!', err);
						});

						_context3.next = 14;
						break;

					case 10:
						_context3.prev = 10;
						_context3.t0 = _context3["catch"](0);

						console.log(_context3.t0);
						res.status(500).json(_context3.t0);

					case 14:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, _this2, [[0, 10]]);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

//get studio by id
router.get("/:id", function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res) {
		var id, api, studio;
		return _regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.prev = 0;
						id = req.params.id;

						if (id) {
							_context4.next = 4;
							break;
						}

						return _context4.abrupt("return", res.status(400).json({ msg: "No studio id provided" }));

					case 4:
						//check for spotify api connection
						api = getSpotifyApi();

						if (api) {
							_context4.next = 7;
							break;
						}

						return _context4.abrupt("return", res.status(403).json({ msg: "No Spotify API connection" }));

					case 7:
						_context4.next = 9;
						return getStudio(id);

					case 9:
						studio = _context4.sent;

						res.status(200).json(studio);
						_context4.next = 16;
						break;

					case 13:
						_context4.prev = 13;
						_context4.t0 = _context4["catch"](0);

						res.status(500).json(_context4.t0);

					case 16:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee4, _this2, [[0, 13]]);
	}));

	return function (_x5, _x6) {
		return _ref4.apply(this, arguments);
	};
}());

//delete studio by id
router.delete("/:id", function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(req, res) {
		var id, studio;
		return _regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.prev = 0;
						id = req.params.id;

						if (id) {
							_context5.next = 4;
							break;
						}

						return _context5.abrupt("return", res.status(400).json({ msg: "No studio id provided" }));

					case 4:
						_context5.next = 6;
						return deleteStudio(id);

					case 6:
						studio = _context5.sent;

						//TODO: remove studio from users
						res.status(204).json(studio);
						_context5.next = 13;
						break;

					case 10:
						_context5.prev = 10;
						_context5.t0 = _context5["catch"](0);

						res.status(500).json(_context5.t0);

					case 13:
					case "end":
						return _context5.stop();
				}
			}
		}, _callee5, _this2, [[0, 10]]);
	}));

	return function (_x7, _x8) {
		return _ref5.apply(this, arguments);
	};
}());

router.post("/:id/toggle", function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(req, res) {
		var id, studio, control, newControl, updated_studio;
		return _regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_context6.prev = 0;
						id = req.params.id;

						if (id) {
							_context6.next = 4;
							break;
						}

						return _context6.abrupt("return", res.status(400).json({ msg: "No studio id provided" }));

					case 4:
						_context6.next = 6;
						return getStudio(id);

					case 6:
						studio = _context6.sent;
						control = studio[0].studioControlHostOnly;
						newControl = !control;
						_context6.next = 11;
						return updateStudioControlHostOnly(id, newControl);

					case 11:
						updated_studio = _context6.sent;

						res.status(200).json(updated_studio);
						_context6.next = 18;
						break;

					case 15:
						_context6.prev = 15;
						_context6.t0 = _context6["catch"](0);

						res.status(500).json(_context6.t0);

					case 18:
					case "end":
						return _context6.stop();
				}
			}
		}, _callee6, _this2, [[0, 15]]);
	}));

	return function (_x9, _x10) {
		return _ref6.apply(this, arguments);
	};
}());

// upload the image for the studio banner
router.post("/upload-image", upload.single("image"), function (req, res) {
	var oldPath = req.file.path;
	var extension = req.file.originalname.substring(req.file.originalname.lastIndexOf("."));
	var newFileName = "" + uuid() + extension;
	var newPath = "./public/images/" + newFileName;

	fs.renameSync(oldPath, newPath);

	res.status(201).header("Location", "/images/" + newFileName).header("Access-Control-Expose-Headers", "Location").send();
});

//leave studio
router.put("/:studio_id/leave/:user", function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(req, res) {
		var _req$params, studio_id, user, studio, listeners, newListeners, studios, newStudios;

		return _regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						_context7.prev = 0;
						_req$params = req.params, studio_id = _req$params.studio_id, user = _req$params.user;

						if (studio_id) {
							_context7.next = 4;
							break;
						}

						return _context7.abrupt("return", res.status(400).json({ msg: "No studio id provided" }));

					case 4:
						if (user) {
							_context7.next = 6;
							break;
						}

						return _context7.abrupt("return", res.status(400).json({ msg: "No user id provided" }));

					case 6:
						_context7.next = 8;
						return getStudio(studio_id);

					case 8:
						studio = _context7.sent;
						listeners = studio[0].studioUsers;

						//remove user from studio

						newListeners = listeners.filter(function (listener) {
							return listener !== JSON.parse(user);
						});
						_context7.next = 13;
						return updateStudioUsers(studio_id, newListeners);

					case 13:
						_context7.next = 15;
						return getStudiosId(JSON.parse(user));

					case 15:
						studios = _context7.sent;
						newStudios = studios.filter(function (studio) {
							return JSON.parse(JSON.stringify(studio._id)) !== studio_id;
						});

						console.log(newStudios);
						updateStudiosUsername(JSON.parse(user), newStudios);

						res.status(200);
						_context7.next = 25;
						break;

					case 22:
						_context7.prev = 22;
						_context7.t0 = _context7["catch"](0);

						res.status(500).json(_context7.t0);

					case 25:
					case "end":
						return _context7.stop();
				}
			}
		}, _callee7, _this2, [[0, 22]]);
	}));

	return function (_x11, _x12) {
		return _ref7.apply(this, arguments);
	};
}());

export default router;