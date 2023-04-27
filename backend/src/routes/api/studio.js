import express from "express";
import { createStudio, getStudio, deleteStudio } from "../../database/studio_dao.js";
import { getUserId, getStudios, updateStudios } from "../../database/user_dao.js";

const router = express.Router();

//create studio
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

    listenerUserIds.forEach(async (listener) => {
      const studios = await getStudios(listener);
      studios.push(newStudio._id);
      updateStudios(listener, studios);
    });
    
    // Respond with the newly created studio
    res.status(201).location(`/api/studio/${newStudio._id}`).json(newStudio);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get studio by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "No studio id provided" });
    }
    const studio = await getStudio(id);
    res.json(studio);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete studio by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "No studio id provided" });
    }
    const studio = await deleteStudio(id);
    res.json(studio);
  } catch (err) {
    res.status(500).json(err);
  }
});


export default router;