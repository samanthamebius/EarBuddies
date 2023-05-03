import express from "express";
import { getUser, getUserbyId, deleteUser, updateUserInfo, searchActiveStudios, searchStudioUsers, searchStudios, searchUsers } from "../../dao/user_dao";
import { deleteUserFromStudio } from "../../dao/studio_dao";

const router = express.Router();

router.get("/users/:username/:query", async (req, res) => {
  const { username, query } = req.params;
  try {
    const users = await searchUsers(query, username);
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users/:username/:query/:studioId", async (req, res) => {
  const { username, query, studioId } = req.params;
  try {
    const users = await searchStudioUsers(studioId, query, username);
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

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

router.get("/:username/studios/:query", async (req, res) => {
  const { username, query } = req.params;
  if (!username) {
    return res.status(400).json({ msg: "No username provided" });
  }
  try {
    const studios = await searchStudios(username, query);
    res.json(studios);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:username/active/:query", async (req, res) => {
  const { username, query } = req.params;
  if (!username) {
    return res.status(400).json({ msg: "No username provided" });
  }
  try {
    const studios = await searchActiveStudios(username, query);
    res.json(studios);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "No user id provided" });
  }
  try {
    await updateUserInfo(id, req.body.userDisplayName, req.body.spotifyPic, req.body.profilePic);
    res.status(204).json({ msg: "User updated" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "No user id provided" });
  }
  try {
    //delete from all studios
    console.log("deleting user from all studios")
    console.log("id is " + id)
    const user = await getUser(id);
    console.log("user is " + user)
    const studios = user.userStudios;
    console.log("studios are " + studios)
    for (var i = 0; i < studios.length; i++) {
      console.log("deleting user from studio " + studios[i])
      await deleteUserFromStudio(studios[i], id);
    }
    // await deleteUser(id);
    res.status(204).json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
