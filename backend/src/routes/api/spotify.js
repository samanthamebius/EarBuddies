import express from "express";
import { searchSpotify } from "../../routes/dao/spotify_dao";

const router = express.Router();

router.get("/search/:query", async (req, res) => {

    try {
        const { query } = req.params;
        const results = await searchSpotify(query);
        res.json(results);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

export default router;