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
        res.status(500).json(err);
    }
});

export default router;