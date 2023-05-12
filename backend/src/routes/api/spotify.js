import express from 'express';
import {
	getSpotifyApi,
	searchSpotify,
	getCurrentTrack,
	getCurrentTrackId,
	getArtist,
	getLastPlaylistTrackId,
	getPlaybackState,
	addPlaylistTrackAndQueue,
	getPlaylist,
	removePlaylistTrack,
	playSpotify,
	resumeSpotify,
	pauseSpotify,
	skipNext,
	skipPrevious,
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
		// Add tracks to a playlist
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		await addPlaylistTrackAndQueue(playlist_id, track_id, type, thisSpotifyApi);
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
		return res.status(200).json(await getPlaylist(playlist_id, thisSpotifyApi));
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   DELETE api/spotify/queue/:playlist_id/:track_id
 * @desc    Remove the selected track from the playlist queue
 * @params  playlist_id: String
 * 			track_id: String
 * @body	snapshot_id: String
 * 			type: String
 * @returns 200 if successful
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.delete('/queue/:playlist_id/:track_id', async (req, res) => {
	try {
		const { playlist_id, track_id } = req.params;
		const { snapshot_id, type } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// Remove tracks from a playlist
		await removePlaylistTrack(
			playlist_id,
			track_id,
			snapshot_id,
			type,
			thisSpotifyApi
		);
		return res.status(200).json({ msg: 'Removed track from playlist' });
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   PUT api/spotify/play
 * @desc    Play a playlist on a device - either starts from beginning of playlist or resumes
 * @body	uri: String
 * 			deviceId: String
 * @returns 200 if successful
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.put('/play', async (req, res) => {
	try {
		const { uri, deviceId } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// check if spotify is active - if yes then resume playing if no then play playlist
		if (await getPlaybackState(thisSpotifyApi, deviceId)) {
			await resumeSpotify(thisSpotifyApi, deviceId);
			return res.status(200).json({ msg: 'Resuming track' });
		} else {
			await playSpotify(thisSpotifyApi, uri, deviceId);
			return res.status(200).json({ msg: 'Playing Playlist' });
		}
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   PUT api/spotify/pause
 * @desc    Pause a playlist on a device
 * @body	deviceId: String
 * @returns 200 if successful
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.put('/pause', async (req, res) => {
	try {
		const { deviceId } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// Pause whatever the device is playing
		await pauseSpotify(deviceId, thisSpotifyApi);
		return res.status(200).json({ msg: 'Pausing Spotify' });
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   PUT api/spotify/next
 * @desc    Skip to the next song in the playlist - if last one restart from beginning
 * @body	deviceId: String
 * 			studio: Object
 * @returns 200 if successful
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.put('/next', async (req, res) => {
	try {
		const { deviceId, studio } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		//check if currently playing song is last in playlist if yes play from start
		//other wise skip to next
		let currentId = await getCurrentTrackId(thisSpotifyApi);
		let lastId = await getLastPlaylistTrackId(thisSpotifyApi, studio.studioPlaylist);
		if (currentId === lastId) {
			await playSpotify(
				thisSpotifyApi,
				'spotify:playlist:' + studio.studioPlaylist,
				deviceId
			);
			return res.status(200).json({ msg: 'Next restart' });
		} else {
			// Skip to next track
			await skipNext(thisSpotifyApi, deviceId);
			return res.status(200).json({ msg: 'Skip to next' });
		}
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   PUT api/spotify/previous
 * @desc    Go to the previous song in the playlist - if first one restart from beginning
 * @body	deviceId: String
 * @returns 200 if successful
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.put('/previous', async (req, res) => {
	try {
		const { deviceId } = req.body;
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		// Skip to previous track
		await skipPrevious(thisSpotifyApi, deviceId);
		return res.status(200).json({ msg: 'Skip to previous' });
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
		res.status(500).json(err);
	}
});

/**
 * @route   GET api/spotify/songinfo
 * @desc    Get info about currently playng track
 * @returns 200 if successful
 * @throws  401 if unauthorized i.e access token has expired
 * @throws  403 if no Spotify API connection
 * @throws  500 if server error
 */
router.get('/songinfo', async (req, res) => {
	try {
		const thisSpotifyApi = getSpotifyApi();
		if (!thisSpotifyApi) {
			return res.status(403).json({ msg: 'No Spotify API connection' });
		}
		const currentTrack = await getCurrentTrack(thisSpotifyApi);
		res.status(200).json(currentTrack);
	} catch (err) {
		console.log(err);
		if (err.statusCode === 401) {
			return res.status(401).json({ msg: 'Unauthorized' });
		}
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
