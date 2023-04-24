import express from "express";
import { createStudio } from "../../database/studio_dao.js";
import { getUser } from "../../database/user_dao.js";

const router = express.Router();

router.post("/new", async (req, res) => {
    console.log("studio: ", req.body)
    const { name, listeners, host, genres, photo, isHostOnly } = req.body;
    const host_user = await getUser(host);
    console.log("host_user: ", host_user);
    const listeners_user = listeners.map(async (listener) => { await getUser(listener)});
    console.log("listeners_user: ", listeners_user);
    try {
        await createStudio(
        name,
        listeners_user,
        host_user,
        genres,
        photo,
        isHostOnly
        );
        res.status(201).location(`/api/studio/`).json(studio);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

export default router;