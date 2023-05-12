import express from 'express';
import { getSpotifyApi } from '../../dao/spotify_dao';
import {
	searchSpotify,
	getCurrentTrack,
	getCurrentTrackId,
	getArtist,
	getLastPlaylistTrackId,
	getPlaybackState,
	addPlaylistTrackAndQueue,
	getPlaylist,
} from '../../dao/spotify_dao';

const router = express.Router();

/**
 * @route   GET api/spotify/search/:playlist_id/:query
 * @desc    Search Spotify for tracks or podcasts to add to a playlist based on a query
 * @params  playlist_id: String
 * 			query: String
 * @returns 200 if successful with search results
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.get('/search/:playlist_id/:query', async (req, res) => {
	try {
		const { playlist_id, query } = req.params;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		const results = await searchSpotify(query, thisSpotifyApi, playlist_id);
		return res.status(200).json(results);
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   PUT api/spotify/queue
 * @desc    Add the selected track from search into the playlist queue
 * @body	playlist_id: String
 * 			track_id: String
 * 			type: String
 * @returns 200 if successful
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.put('/queue', async (req, res) => {
	try {
		const { playlist_id, track_id, type } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// Add tracks to a playlist
		await addPlaylistTrackAndQueue(playlist_id, track_id, type);
		return res.status(200).json({ msg: 'Added track to playlist' });
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   GET api/spotify/queue/:playlist_id
 * @desc	Get a playlist from specific id
 * @params  playlist_id: String
 * @returns 200 if successful with playlist object
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.get('/queue/:playlist_id', async (req, res) => {
	try {
		const { playlist_id } = req.params;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		return res.status(200).json(await getPlaylist(playlist_id));
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

router.delete('/queue/:playlist_id/:track_id', async (req, res) => {
	try {
		const { playlist_id, track_id } = req.params;
		const { snapshot_id, type } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// Remove tracks from a playlist
		thisSpotifyApi
			.removeTracksFromPlaylist(
				playlist_id,
				[{ uri: 'spotify:' + type + ':' + track_id }],
				{ snapshot_id: snapshot_id }
			)
			.then(
				function (data) {
					return res.status(200).json({ msg: 'Removed track from playlist' });
				},
				function (err) {
					console.log('Something went wrong!', err);
				}
			);
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

router.put('/play', async (req, res) => {
	try {
		const { uri, deviceId } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		console.log('PLAYING ON ' + deviceId);
		// Play a track if not playing already
		// will need an if statement to check where it finished to pick it up at correct point
		// ooh or just called with no uri and it will resume
		console.log(await getPlaybackState(thisSpotifyApi, deviceId));
		if (await getPlaybackState(thisSpotifyApi, deviceId)) {
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
			return res.status(200).json({ msg: 'Resuming track' });
		} else {
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
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

router.put('/pause', async (req, res) => {
	try {
		const { deviceId } = req.body;
		console.log(deviceId);
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// Pause a track if not paused already
		thisSpotifyApi.pause({ device_id: deviceId }).then(
			function () {
				console.log('Paused track!');
			},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

router.put('/next', async (req, res) => {
	try {
		const { deviceId, studio } = req.body;
		console.log('device id ' + deviceId);
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		//check if currently playing song is last in playlist if yes play from start
		//other wise skip to next
		let currentId = await getCurrentTrackId(thisSpotifyApi);
		let lastId = await getLastPlaylistTrackId(thisSpotifyApi, studio.studioPlaylist);
		console.log('current ' + currentId);
		console.log('last ' + lastId);
		if (currentId === lastId) {
			thisSpotifyApi
				.play({
					context_uri: 'spotify:playlist:' + studio.studioPlaylist,
					device_id: deviceId,
					offset: { position: 0 },
				})
				.then(
					function () {
						console.log('Playing track!');
					},
					function (err) {
						console.log('Something went wrong!', err);
					}
				);
		} else {
			// Skip to next track
			thisSpotifyApi.skipToNext({ device_id: deviceId }).then(
				function () {
					console.log('Skipped to next track!');
				},
				function (err) {
					console.log('Something went wrong!', err);
				}
			);
		}
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

router.put('/previous', async (req, res) => {
	try {
		const { deviceId } = req.body;
		console.log('device id ' + deviceId);
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// Skip to previous track
		thisSpotifyApi.skipToPrevious({ device_id: deviceId }).then(
			function () {
				console.log('Skipped to previous track!');
			},
			function (err) {
				console.log('Something went wrong!', err);
			}
		);
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

router.get('/songinfo', async (req, res) => {
	try {
		const thisSpotifyApi = getSpotifyApi();
		const currentTrack = await getCurrentTrack(thisSpotifyApi);
		res.status(200).json(currentTrack);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/artist/:artist_id', async (req, res) => {
	try {
		const { artist_id } = req.params;
		const thisSpotifyApi = getSpotifyApi();
		const artist = await getArtist(artist_id, thisSpotifyApi);
		res.status(200).json(artist);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
