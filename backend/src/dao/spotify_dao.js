import dotenv from 'dotenv';
import { getStudio, updateStudioHost, updateStudioPlaylist } from './studio_dao';
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

async function createNewStudioPlaylist(studio) {
  const playlist_name = 'Earbuddies - ' + studio[0].studioName;
	const api = getSpotifyApi();
	if (!api) {
		console.log('No Spotify API connection');
		return res.status(403).json({ msg: 'No Spotify API connection' });
	}
	const createPlaylistRes = await api.createPlaylist(playlist_name, {
		public: true,
	});
	return createPlaylistRes.body.id;
}

async function copyPlaylist(old_playlist, new_playlist) {
  const api = getSpotifyApi();
  if (!api) {
		console.log('No Spotify API connection');
		return res.status(403).json({ msg: 'No Spotify API connection' });
  }
  api.getPlaylistTracks(old_playlist)
    .then(function (data) {
      const tracks = [];
      for (var i = 0; i < data.body.items.length; i++) {
        tracks.push(data.body.items[i].track.uri);
      }
      if (tracks.length > 0) {
        api.addTracksToPlaylist(new_playlist, tracks)
          .then(function (data) {
            console.log('Added tracks to playlist!');
          }, function (err) {
            console.log('Something went wrong!', err);
          });
      }
      
    }
  );
}

async function transferPlaylist(studio_id, host) {
  console.log('Transfering playlist')
  const studio = await getStudio(studio_id);
  const old_playlist = studio[0].studioPlaylist;
  const new_playlist = await createNewStudioPlaylist(studio);
  console.log(new_playlist);
  await copyPlaylist(old_playlist, new_playlist);
  await updateStudioPlaylist(studio_id, new_playlist);
  console.log("set new host " + host);
  await updateStudioHost(studio_id, host);
  console.log(await getStudio(studio_id));
  const updated_studio = await getStudio(studio_id);
  return updated_studio.studioHost;
}

export { searchSpotify, setSpotifyApi, getSpotifyApi, getCurrentTrackId, getCurrentTrack, getArtist, getLastPlaylistTrackId, getPlaybackState, createNewStudioPlaylist, copyPlaylist, transferPlaylist };

