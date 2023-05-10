import _regeneratorRuntime from 'babel-runtime/regenerator';

var refreshAccessToken = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(thisSpotifyApi, refresh_tokenSet) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            thisSpotifyApi.refreshAccessToken().then(function (data) {
              var access_token = data.body['access_token'];
              var expires_in = data.body['expires_in'];
              thisSpotifyApi.setAccessToken(access_token);
              console.log('The access token has been refreshed!');
            }).catch(function (err) {
              console.log(err);
            });

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function refreshAccessToken(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @route POST api/refresh
 * @desc Refresh the access token
 * @access Public
 * @param {string} refresh_token - The refresh token
 * @returns {object} - The access token and expiration time
 */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import SpotifyWebApi from "spotify-web-api-node";

var router = express.Router();
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", function (req, res) {
  var refresh_token = req.body.refresh_token;
  var spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refresh_token: refresh_token
  });

  spotifyApi.refreshAccessToken().then(function (data) {
    var access_token = data.body['access_token'];
    var expires_in = data.body['expires_in'];
    spotifyApi.setAccessToken(access_token);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(400);
  });
});

export default router;
export { refreshAccessToken };