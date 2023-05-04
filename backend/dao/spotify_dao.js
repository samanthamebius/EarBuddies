import _regeneratorRuntime from 'babel-runtime/regenerator';

var searchSpotify = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(query, thisSpotifyApi) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              thisSpotifyApi.search(query, ['track', 'episode', 'audiobook']).then(function (data) {
                var results = [];
                for (var i = 0; i < data.body.tracks.items.length; i++) {
                  var track = {
                    name: data.body.tracks.items[i].name,
                    image: data.body.tracks.items[i].album.images[0].url,
                    artists: [],
                    id: data.body.tracks.items[i].id,
                    type: "track"
                  };
                  for (var j = 0; j < data.body.tracks.items[i].artists.length; j++) {
                    track.artists.push(data.body.tracks.items[i].artists[j].name);
                  }
                  results.push(track);
                }
                for (var i = 0; i < data.body.episodes.items.length; i++) {
                  var episode = {
                    name: data.body.episodes.items[i].name,
                    image: data.body.episodes.items[i].images[0].url,
                    id: data.body.episodes.items[i].id,
                    type: "episode"
                  };
                  results.push(episode);
                }
                for (var i = 0; i < data.body.audiobooks.items.length; i++) {
                  var audiobook = {
                    name: data.body.audiobooks.items[i].name,
                    image: data.body.audiobooks.items[i].images[0].url,
                    id: data.body.audiobooks.items[i].id,
                    authors: [],
                    type: "audiobook"
                  };
                  for (var j = 0; j < data.body.audiobooks.items[i].authors.length; j++) {
                    audiobook.authors.push(data.body.audiobooks.items[i].authors[j].name);
                  }
                  if (!data.body.audiobooks.items[i].explicit) {
                    results.push(audiobook);
                  }
                }
                resolve(results);
              }).catch(function (err) {
                console.log("Something went wrong!", err);
                reject(err);
              });
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function searchSpotify(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import dotenv from 'dotenv';
dotenv.config();

var spotifyApi = null;

function setSpotifyApi(api) {
  spotifyApi = api;
}

function getSpotifyApi() {
  return spotifyApi;
}

export { searchSpotify, setSpotifyApi, getSpotifyApi };