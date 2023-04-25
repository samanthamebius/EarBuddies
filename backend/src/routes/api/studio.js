import express from "express";
import { createStudio } from "../../database/studio_dao.js";
import { getUserId } from "../../database/user_dao.js";

const router = express.Router();

router.post("/new", async (req, res) => {
  try {
    const { name, listeners, host, genres, photo, isHostOnly } = req.body;

    // Get the user IDs for the host and listeners
    const hostUserId = await getUserId(host);
    const listenerUserIds = await Promise.all(listeners.map(getUserId));

    // Create the new studio
    const newStudio = await createStudio(
      name,
      listenerUserIds,
      hostUserId,
      genres,
      photo,
      isHostOnly
    );

    // Respond with the newly created studio
    res.status(201).json(newStudio);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;