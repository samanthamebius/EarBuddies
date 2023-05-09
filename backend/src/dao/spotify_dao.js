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
        const regex = new RegExp(`^${query}`, 'i');
        for (var i = 0; i < data.body.tracks.items.length; i++) {
          // check if the track name starts with the query term
          if (regex.test(data.body.tracks.items[i].name)) {
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
        }
        for (var i = 0; i < data.body.episodes.items.length; i++) {
          // check if the episode name starts with the query term
          if (regex.test(data.body.episodes.items[i].name)) {
            var episode = {
              name: data.body.episodes.items[i].name,
              image: data.body.episodes.items[i].images[0].url,
              id: data.body.episodes.items[i].id,
              type: "episode"
            };
            results.push(episode);
          }
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

async function getCurrentTrack(thisSpotifyApi) {
  return new Promise((resolve, reject) => {
    thisSpotifyApi.getMyCurrentPlayingTrack({ additional_types: 'episode' })
      .then(function (data) {
        resolve(data.body);
      }, function (err) {
        console.log('Something went wrong!', err);
        reject(err);
      });
  });
}

async function getArtist(artist_id, thisSpotifyApi) {
  return new Promise((resolve, reject) => {
    thisSpotifyApi.getArtist(artist_id) 
      .then(function (data) {
        resolve(data.body);
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


async function getPlaybackState(thisSpotifyApi, deviceId) {
  return new Promise((resolve, reject) => {
    thisSpotifyApi.getMyCurrentPlaybackState({ additional_types: 'episode' })
      .then(function (data) {
        if (data.statusCode == 200 && data.body.device.id == deviceId) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, function (err) {
        console.log('Something went wrong!', err);
        reject(err);
      });
  });
}

export { searchSpotify, setSpotifyApi, getSpotifyApi, getCurrentTrackId, getCurrentTrack, getArtist, getLastPlaylistTrackId, getPlaybackState };

