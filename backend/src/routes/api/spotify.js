import express from "express";
import { searchSpotify } from "../../routes/dao/spotify_dao";

const router = express.Router();

router.post("/search/:query", async (req, res) => {
    const refresh_token = req.body.refresh_token;
    try {
        const { query } = req.params;
        const results = await searchSpotify(query, refresh_token);
        res.json(results);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

export default router;