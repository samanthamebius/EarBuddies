import dotenv from 'dotenv';
dotenv.config();

var spotifyApi = null;

function setSpotifyApi(api) {
  spotifyApi = api;
}

function getSpotifyApi() {
  return spotifyApi;
}

async function searchSpotify(query, thisSpotifyApi) {
  return new Promise((resolve, reject) => {
    thisSpotifyApi.search(query, ['track'])
      .then(function (data) {
        const results = [];
        for (var i = 0; i < data.body.tracks.items.length; i++) {
          const track = {
            name: data.body.tracks.items[i].name,
            image: data.body.tracks.items[i].album.images[0].url,
            artists: [],
            id: data.body.tracks.items[i].id,
            type: "track"
          }
          for (var j = 0; j < data.body.tracks.items[i].artists.length; j++) {
            track.artists.push(data.body.tracks.items[i].artists[j].name);
          }
          results.push(track);
        }
        resolve(results);
      })
      .catch(function (err) {
        console.log("Something went wrong!", err);
        reject(err);
      });
  });
}

async function playSpotify(uri, thisSpotifyApi) {
  return new Promise((resolve, reject) => {
    thisSpotifyApi.play({ uris: [uri] })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        console.log("Something went wrong!", err);
        reject(err);
      });
  });
}

export { searchSpotify, setSpotifyApi, getSpotifyApi };