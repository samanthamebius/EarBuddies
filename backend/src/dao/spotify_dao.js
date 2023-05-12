import dotenv from 'dotenv';
import { getStudio, updateStudioHost, updateStudioPlaylist } from './studio_dao';
import { getStudiosId, updateStudios } from './user_dao';
dotenv.config();

var spotifyApi = null;

/**
 * set the spotify api from login
 * @param api
 */
function setSpotifyApi(api) {
	spotifyApi = api;
}

/**
 * get spotify api to be used in routes
 * @returns spotify api object
 */
function getSpotifyApi() {
	return spotifyApi;
}

/**
 * search spotify for a track or episode
 * @param query
 * @param thisSpotifyApi
 * @param playlist
 * @returns list of search results
 */
async function searchSpotify(query, thisSpotifyApi, playlist) {
	const tracks = [];
	thisSpotifyApi.getPlaylistTracks(playlist).then(function (data) {
		for (var i = 0; i < data.body.items.length; i++) {
			tracks.push(data.body.items[i].track.uri);
		}
	});
	return new Promise((resolve, reject) => {
		thisSpotifyApi
			.search(query, ['track', 'episode'])
			.then(function (data) {
				const results = [];
				const regex = new RegExp(`^${query}`, 'i');
				for (var i = 0; i < data.body.tracks.items.length; i++) {
					// check if the track name starts with the query term
					if (regex.test(data.body.tracks.items[i].name)) {
						// get the track info
						const track = {
							name: data.body.tracks.items[i].name,
							image: data.body.tracks.items[i].album.images[0].url,
							artists: [],
							id: data.body.tracks.items[i].id,
							type: 'track',
						};

						// get the artists of the track in a nice format with spacing
						for (
							var j = 0;
							j < data.body.tracks.items[i].artists.length;
							j++
						) {
							track.artists.push(data.body.tracks.items[i].artists[j].name);
						}

						//don't add the track if it's already in the playlist
						if (!tracks.includes(data.body.tracks.items[i].uri)) {
							results.push(track);
						}
					}
				}

				// do the same for episodes
				for (var i = 0; i < data.body.episodes.items.length; i++) {
					// check if the episode name starts with the query term
					if (regex.test(data.body.episodes.items[i].name)) {
						// get episode info
						var episode = {
							name: data.body.episodes.items[i].name,
							image: data.body.episodes.items[i].images[0].url,
							id: data.body.episodes.items[i].id,
							type: 'episode',
						};

						//don't add the episode if it's already in the playlist
						if (!tracks.includes(data.body.episodes.items[i].uri)) {
							results.push(episode);
						}
					}
				}
				resolve(results);
			})
			.catch(function (err) {
				console.log('Something went wrong!', err);
				reject(err);
			});
	});
}

/**
 * get the current track id
 * @param thisSpotifyApi
 * @returns track id
 */
async function getCurrentTrackId(thisSpotifyApi) {
	return new Promise((resolve, reject) => {
		thisSpotifyApi.getMyCurrentPlayingTrack({ additional_types: 'episode' }).then(
			function (data) {
				resolve(data.body.item.id);
			},
			function (err) {
				console.log('Something went wrong!', err);
				reject(err);
			}
		);
	});
}

/**
 * get the current track
 * @param thisSpotifyApi
 * @returns track object
 */
async function getCurrentTrack(thisSpotifyApi) {
	return new Promise((resolve, reject) => {
		thisSpotifyApi.getMyCurrentPlayingTrack({ additional_types: 'episode' }).then(
			function (data) {
				resolve(data.body);
			},
			function (err) {
				console.log('Something went wrong!', err);
				reject(err);
			}
		);
	});
}

/**
 * get the current track artist
 * @param thisSpotifyApi
 * @param artist_id
 * @returns artist object
 */
async function getArtist(artist_id, thisSpotifyApi) {
	return new Promise((resolve, reject) => {
		thisSpotifyApi.getArtist(artist_id).then(
			function (data) {
				resolve(data.body);
			},
			function (err) {
				console.log('Something went wrong!', err);
				reject(err);
			}
		);
	});
}

/**
 * find the last track/episode in the playlist
 * @param thisSpotifyApi
 * @param playlist_id
 * @returns track id that is last in the playlist
 */
async function getLastPlaylistTrackId(thisSpotifyApi, playlist_id) {
	return new Promise((resolve, reject) => {
		thisSpotifyApi.getPlaylistTracks(playlist_id).then(
			function (data) {
				resolve(data.body.items[data.body.items.length - 1].track.id);
			},
			function (err) {
				console.log('Something went wrong!', err);
				reject(err);
			}
		);
	});
}

/**
 * get the current playback state
 * @param thisSpotifyApi
 * @param deviceId
 * @returns true if playing on the device, false if not
 */
async function getPlaybackState(thisSpotifyApi, deviceId) {
	return new Promise((resolve, reject) => {
		thisSpotifyApi.getMyCurrentPlaybackState({ additional_types: 'episode' }).then(
			function (data) {
				// check that there is a response and that the device id matches
				if (data.statusCode == 200 && data.body.device.id == deviceId) {
					resolve(true);
				} else {
					resolve(false);
				}
			},
			function (err) {
				console.log('Something went wrong!', err);
				reject(err);
			}
		);
	});
}

/**
 * create a new playlist for the studio
 * @param studio
 * @returns the new playlist id
 */
async function createStudioPlaylist(name) {
	const playlist_name = 'Earbuddies - ' + name;
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

/**
 * copy over playlist tracks from old playlist to new playlist
 * @param old_playlist
 * @param new_playlist
 */
async function copyPlaylist(old_playlist, new_playlist) {
	const api = getSpotifyApi();
	if (!api) {
		return res.status(403).json({ msg: 'No Spotify API connection' });
	}
	api.getPlaylistTracks(old_playlist).then(function (data) {
		const tracks = [];
		for (var i = 0; i < data.body.items.length; i++) {
			tracks.push(data.body.items[i].track.uri);
		}
		if (tracks.length > 0) {
			api.addTracksToPlaylist(new_playlist, tracks).then(
				function (data) {},
				function (err) {
					console.log('Something went wrong!', err);
				}
			);
		}
	});
}

/**
 * changes playlist to new playlist and update host in db
 * @param studio_id
 * @param host
 * @returns new host
 */
async function transferPlaylist(studio_id, host) {
	const studio = await getStudio(studio_id);
	const old_playlist = studio[0].studioPlaylist;
	const new_playlist = await createNewStudioPlaylist(studio);
	await copyPlaylist(old_playlist, new_playlist);
	await updateStudioPlaylist(studio_id, new_playlist);
	await updateStudioHost(studio_id, host);
	const updated_studio = await getStudio(studio_id);
	return updated_studio.studioHost;
}

/**
 * add track to playlist
 * @param playlist_id
 * @param track_id
 * @param type
 * @param thisSpotifyApi
 */
async function addPlaylistTrackAndQueue(playlist_id, track_id, type, thisSpotifyApi) {
	thisSpotifyApi
		.addTracksToPlaylist(playlist_id, ['spotify:' + type + ':' + track_id])
		.then(
			function (data) {},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
}

/**
 * remove a track from the playlist
 * @param playlist_id
 * @param track_id
 * @param snapshot_id
 * @param type
 * @param thisSpotifyApi
 */
async function removePlaylistTrack(
	playlist_id,
	track_id,
	snapshot_id,
	type,
	thisSpotifyApi
) {
	thisSpotifyApi
		.removeTracksFromPlaylist(
			playlist_id,
			[{ uri: 'spotify:' + type + ':' + track_id }],
			{ snapshot_id: snapshot_id }
		)
		.then(
			function (data) {},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
}

/**
 * get the playlist object
 * @param playlist_id
 * @param thisSpotifyApi
 * @returns playlist object
 */
async function getPlaylist(playlist_id, thisSpotifyApi) {
	return new Promise((resolve, reject) => {
		thisSpotifyApi.getPlaylist(playlist_id).then(
			function (data) {
				resolve(data.body);
			},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
	});
}

/**
 * resume playing spotify
 * @param thisSpotifyApi
 * @param deviceId
 */
async function resumeSpotify(thisSpotifyApi, deviceId) {
	thisSpotifyApi.play({ device_id: deviceId }).then(
		function () {
			thisSpotifyApi.setRepeat('context', { device_id: deviceId }).then(
				function () {},
				function (err) {
					console.log('Something went wrong!', err);
				}
			);
		},
		function (err) {
			console.log('Something went wrong!', err);
		}
	);
}

/**
 * play a spotify playlist from beginning
 * @param thisSpotifyApi
 * @param uri
 * @param deviceId
 */
async function playSpotify(thisSpotifyApi, uri, deviceId) {
	thisSpotifyApi
		.play({
			context_uri: uri,
			device_id: deviceId,
			offset: { position: 0 },
		})
		.then(
			function () {
				thisSpotifyApi.setRepeat('context', { device_id: deviceId }).then(
					function () {},
					function (err) {
						console.log('Something went wrong!', err);
					}
				);
			},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
}

/**
 * pause spotify
 * @param deviceId
 * @param thisSpotifyApi
 */
async function pauseSpotify(deviceId, thisSpotifyApi) {
	thisSpotifyApi.pause({ device_id: deviceId }).then(
		function () {},
		function (err) {
			console.log('Something went wrong!', err);
		}
	);
}

/**
 * skip to next track
 * @param thisSpotifyApi
 * @param deviceId
 */
async function skipNext(thisSpotifyApi, deviceId) {
	thisSpotifyApi.skipToNext({ device_id: deviceId }).then(
		function () {},
		function (err) {
			console.log('Something went wrong!', err);
		}
	);
}

/**
 * skip to previous track
 * @param thisSpotifyApi
 * @param deviceId
 */
async function skipPrevious(thisSpotifyApi, deviceId) {
	thisSpotifyApi.skipToPrevious({ device_id: deviceId }).then(
		function () {},
		function (err) {
			console.log('Something went wrong!', err);
		}
	);
}

export {
	searchSpotify,
	setSpotifyApi,
	getSpotifyApi,
	getCurrentTrackId,
	getCurrentTrack,
	getArtist,
	getLastPlaylistTrackId,
	getPlaybackState,
	copyPlaylist,
	transferPlaylist,
	addPlaylistTrackAndQueue,
	getPlaylist,
	removePlaylistTrack,
	resumeSpotify,
	playSpotify,
	pauseSpotify,
	skipNext,
	skipPrevious,
	createStudioPlaylist,
};
