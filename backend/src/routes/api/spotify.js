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
    console.log("called queue")
    try {
      const { playlist_id, track_id } = req.body;
      console.log("playlist_id: " + playlist_id);
      console.log("track_id: " + track_id);
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
      // thisSpotifyApi
      //   .addTracksToPlaylist(
      //     playlist_id,
      //     "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"
      //   )
      //   .then(
      //     function (data) {
      //       console.log("Added tracks to playlist!");
      //     },
      //     function (err) {
      //       console.log("Something went wrong!", err);
      //     }
      //   );
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