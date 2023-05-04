import _regeneratorRuntime from "babel-runtime/regenerator";

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import express from "express";
import { getSpotifyApi } from "../../dao/spotify_dao";
import { searchSpotify } from "../../dao/spotify_dao";

var router = express.Router();

router.get("/search/:query", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(req, res) {
        var query, thisSpotifyApi, results;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        query = req.params.query;
                        thisSpotifyApi = getSpotifyApi();

                        if (thisSpotifyApi) {
                            _context.next = 5;
                            break;
                        }

                        return _context.abrupt("return", res.status(403).json({ msg: "No Spotify API connection" }));

                    case 5:
                        _context.next = 7;
                        return searchSpotify(query, thisSpotifyApi);

                    case 7:
                        results = _context.sent;

                        res.json(results);
                        _context.next = 17;
                        break;

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context["catch"](0);

                        console.log(_context.t0);

                        if (!(_context.t0.statusCode === 401)) {
                            _context.next = 16;
                            break;
                        }

                        return _context.abrupt("return", res.status(401).json({ msg: "Unauthorized" }));

                    case 16:
                        res.status(500).json(_context.t0);

                    case 17:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this, [[0, 11]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

router.put("/queue", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(req, res) {
        var _req$body, playlist_id, track_id, thisSpotifyApi;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _req$body = req.body, playlist_id = _req$body.playlist_id, track_id = _req$body.track_id;
                        thisSpotifyApi = getSpotifyApi();

                        if (thisSpotifyApi) {
                            _context2.next = 5;
                            break;
                        }

                        return _context2.abrupt("return", res.status(403).json({ msg: "No Spotify API connection" }));

                    case 5:
                        // Add tracks to a playlist
                        thisSpotifyApi.addTracksToPlaylist(playlist_id, ["spotify:track:" + track_id]).then(function (data) {
                            console.log("Added tracks to playlist!");
                        }, function (err) {
                            console.log("Something went wrong!", err);
                        });
                        _context2.next = 14;
                        break;

                    case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2["catch"](0);

                        console.log(_context2.t0);

                        if (!(_context2.t0.statusCode === 401)) {
                            _context2.next = 13;
                            break;
                        }

                        return _context2.abrupt("return", res.status(401).json({ msg: "Unauthorized" }));

                    case 13:
                        res.status(500).json(_context2.t0);

                    case 14:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, _this, [[0, 8]]);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());

router.get("/queue/:playlist_id", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(req, res) {
        var playlist_id, thisSpotifyApi;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        playlist_id = req.params.playlist_id;
                        thisSpotifyApi = getSpotifyApi();

                        if (thisSpotifyApi) {
                            _context3.next = 5;
                            break;
                        }

                        return _context3.abrupt("return", res.status(403).json({ msg: "No Spotify API connection" }));

                    case 5:
                        thisSpotifyApi.getPlaylist(playlist_id).then(function (data) {
                            res.status(200).json(data.body);
                        }, function (err) {
                            console.log('Something went wrong!', err);
                        });
                        _context3.next = 14;
                        break;

                    case 8:
                        _context3.prev = 8;
                        _context3.t0 = _context3["catch"](0);

                        console.log(_context3.t0);

                        if (!(_context3.t0.statusCode === 401)) {
                            _context3.next = 13;
                            break;
                        }

                        return _context3.abrupt("return", res.status(401).json({ msg: "Unauthorized" }));

                    case 13:
                        res.status(500).json(_context3.t0);

                    case 14:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, _this, [[0, 8]]);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

router.delete("/queue/:playlist_id/:track_id", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(req, res) {
        var _req$params, playlist_id, track_id, snapshot_id, thisSpotifyApi;

        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _req$params = req.params, playlist_id = _req$params.playlist_id, track_id = _req$params.track_id;
                        snapshot_id = req.body.snapshot_id;
                        thisSpotifyApi = getSpotifyApi();

                        if (thisSpotifyApi) {
                            _context4.next = 6;
                            break;
                        }

                        return _context4.abrupt("return", res.status(403).json({ msg: "No Spotify API connection" }));

                    case 6:
                        // Remove tracks from a playlist
                        thisSpotifyApi.removeTracksFromPlaylist(playlist_id, [{ uri: "spotify:track:" + track_id }], { snapshot_id: snapshot_id }).then(function (data) {
                            console.log("Tracks removed from playlist!");
                        }, function (err) {
                            console.log("Something went wrong!", err);
                        });
                        _context4.next = 15;
                        break;

                    case 9:
                        _context4.prev = 9;
                        _context4.t0 = _context4["catch"](0);

                        console.log(_context4.t0);

                        if (!(_context4.t0.statusCode === 401)) {
                            _context4.next = 14;
                            break;
                        }

                        return _context4.abrupt("return", res.status(401).json({ msg: "Unauthorized" }));

                    case 14:
                        res.status(500).json(_context4.t0);

                    case 15:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, _this, [[0, 9]]);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());

export default router;