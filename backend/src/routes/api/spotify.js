import express from "express";
import { getSpotifyApi } from "../../dao/spotify_dao";
import { searchSpotify } from "../../dao/spotify_dao";

const router = express.Router();

router.get("/search/:query", async (req, res) => {
    try {
        const { query } = req.params;
        const thisSpotifyApi = getSpotifyApi();
        if (!thisSpotifyApi) {
            return res.status(403).json({ msg: "No Spotify API connection" });
        }
        const results = await searchSpotify(query, thisSpotifyApi);
        res.json(results);
    }
    catch (err) {
        console.log(err);
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        res.status(500).json(err);
    }
});

router.put("/queue", async (req, res) => {
    try {
        const { playlist_id, track_id } = req.body;
        const thisSpotifyApi = getSpotifyApi();
        if (!thisSpotifyApi) {
            return res.status(403).json({ msg: "No Spotify API connection" });
        }
        // Add tracks to a playlist
        thisSpotifyApi
            .addTracksToPlaylist(playlist_id, [
                "spotify:track:" + track_id,
            ])
            .then(
                function (data) {
                    console.log("Added tracks to playlist!");
                },
                function (err) {
                    console.log("Something went wrong!", err);
                }
            );
    }
    catch (err) {
        console.log(err);
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        res.status(500).json(err);
    }
});

router.get("/queue/:playlist_id", async (req, res) => {
    try {
        const { playlist_id } = req.params;
        const thisSpotifyApi = getSpotifyApi();
        if (!thisSpotifyApi) {
            return res.status(403).json({ msg: "No Spotify API connection" });
        }
        thisSpotifyApi.getPlaylist(playlist_id)
            .then(function (data) {
                res.status(200).json(data.body);
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    }
    catch (err) {
        console.log(err);
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        res.status(500).json(err);
    }
});

router.delete("/queue/:playlist_id/:track_id", async (req, res) => {
    try {
        const { playlist_id, track_id } = req.params;
        const { snapshot_id } = req.body;
        const thisSpotifyApi = getSpotifyApi();
        if (!thisSpotifyApi) {
            return res.status(403).json({ msg: "No Spotify API connection" });
        }
        // Remove tracks from a playlist
        thisSpotifyApi
            .removeTracksFromPlaylist(playlist_id, [{ uri: "spotify:track:" + track_id }], { snapshot_id: snapshot_id })
            .then(
                function (data) {
                    console.log("Tracks removed from playlist!");
                },
                function (err) {
                    console.log("Something went wrong!", err);
                }
            );
    }
    catch (err) {
        console.log(err);
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        res.status(500).json(err);
    }
});

router.put("/play", async (req, res) => {
    try {
        const { uri, deviceId } = req.body;
        console.log(uri);
        console.log(deviceId);
        const thisSpotifyApi = getSpotifyApi();
        if (!thisSpotifyApi) {
            return res.status(403).json({ msg: "No Spotify API connection" });
        }
        // Play a track
        thisSpotifyApi.play({ context_uri: uri, device_id: deviceId })
            .then(function () {
                console.log('Playing track!');
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    }
    catch (err) {
        console.log(err);
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        res.status(500).json(err);
    }
});

export default router;