import express from "express";
import { getUser, getUserbyId, searchStudios } from "../../dao/user_dao";
import { getStudios } from "../../dao/studio_dao";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "No user id provided" });
  }
  try {
    var user = await getUser(id);
    if (!user) {
      user = await getUserbyId(id);
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id/studios", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "No user id provided" });
  }
  try {
    const studios = searchStudios(id);
    res.json(studios);
  } catch (err) {
    res.status(500).json(err);
  }
});


export default router;
