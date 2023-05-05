import express from "express";
import {
  getUser,
  deleteUser,
  searchStudios,
  searchActiveStudios,
  searchUsers,
  searchStudioUsers,
  updateUserDisplayName,
  updateUserProfilePic,
  setUserInactive,
} from "../../dao/user_dao";
import { deleteUserFromStudio } from "../../dao/studio_dao";

const router = express.Router();

// User methods

//Get a single user
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update a user
router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { userDisplayName, profilePic } = req.body;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    if (userDisplayName) {
      await updateUserDisplayName(username, userDisplayName);
    }
    if (profilePic) {
      await updateUserProfilePic(username, profilePic);
    }
    return res.status(204).json({ msg: "User updated" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete a user
router.delete("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    const studios = user.userStudios;
    for (var i = 0; i < studios.length; i++) {
      console.log("deleting user from studio " + studios[i])
      await deleteUserFromStudio(studios[i], username);
    }
    await deleteUser(username);    
    return res.status(204).json({ msg: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//log out a user
router.put("/:username/logout", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    await setUserInactive(username);
    return res.status(204).json({ msg: "User logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Search methods

//serch for users
router.get("/users/:username/:query", async (req, res) => {
  const { username, query } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    const users = await searchUsers(query, username);
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//search for users in a studio
router.get("/users/:username/:query/:studioId", async (req, res) => {
  const { username, query, studioId } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    const users = await searchStudioUsers(studioId, query, username);
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//search for studios
router.get("/:username/studios/:query", async (req, res) => {
  const { username, query } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    const studios = await searchStudios(username, query);
    if (!studios) {
      return res.status(404).json({ msg: "No studios found" });
    }
    return res.json(studios);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//search for active studios
router.get("/:username/active/:query", async (req, res) => {
  const { username, query } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    const studios = await searchActiveStudios(username, query);
    if (!studios) {
      return res.status(404).json({ msg: "No active studios found" });
    }
    return res.json(studios);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
