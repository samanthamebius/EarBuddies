import express from "express";
import { getStudio } from "../../database/studio_dao";

const router = express.Router();

router.post("/new", async (req, res) => {
    const { name, listeners, host, genres, photo, isHostOnly } = req.body;
    if ( !name || !host || !genres || !photo || !isHostOnly) {
        return res.status(400).json({ msg: "Missing required fields" });
    }
    try {
        const studio_id = await createStudio(
        id,
        name,
        listeners,
        host,
        genres,
        photo,
        isHostOnly
        );
        res.json(getStudio(studio_id));
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;