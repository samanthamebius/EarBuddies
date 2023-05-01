import express from "express";
import { getUser, getUserbyId, getUsers, searchActiveStudios, searchStudios } from "../../dao/user_dao";

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

router.get("/:username/studios", async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ msg: "No username provided" });
  }
  try {
    const studios = searchStudios(username);
    res.json(studios);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:username/active", async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ msg: "No username provided" });
  }
  try {
    const studios = await searchActiveStudios(username);
    res.json(studios);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
