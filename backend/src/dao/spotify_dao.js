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
    thisSpotifyApi.search(query, ['track', 'episode'])
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
        for (var i = 0; i < data.body.episodes.items.length; i++) {
          var episode = {
            name: data.body.episodes.items[i].name,
            image: data.body.episodes.items[i].images[0].url,
            id: data.body.episodes.items[i].id,
            type: "episode"
          };
          results.push(episode);
        }
        resolve(results);
      })
      .catch(function (err) {
        console.log("Something went wrong!", err);
        reject(err);
      });
  });
}

async function getCurrentTrackId(thisSpotifyApi) {
  return new Promise((resolve, reject) => {
    thisSpotifyApi.getMyCurrentPlayingTrack({ additional_types: 'episode' })
      .then(function (data) {
        resolve(data.body.item.id);
      }, function (err) {
        console.log('Something went wrong!', err);
        reject(err);
      });
  });
}

async function getLastPlaylistTrackId(thisSpotifyApi, playlist_id) {
  return new Promise((resolve, reject) => {
    thisSpotifyApi.getPlaylistTracks(playlist_id)
      .then(function (data) {
        resolve(data.body.items[data.body.items.length - 1].track.id);
      }, function (err) {
        console.log('Something went wrong!', err);
        reject(err);
      });
  });
}

export { searchSpotify, setSpotifyApi, getSpotifyApi, getCurrentTrackId, getLastPlaylistTrackId };