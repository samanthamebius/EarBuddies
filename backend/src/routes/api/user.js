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
  updateUserSpotifyPic
} from "../../dao/user_dao";
import { deleteUserFromStudio, setStudioStatus } from "../../dao/studio_dao";

const router = express.Router();

/**
 * @route GET api/user/:username
 * @desc Get a user by username
 * @param username: String (the username of the user)
 * @returns The user object
 * @throws 404 If the user is not found
 * @throws 500 If there is an internal server error
 */
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

/**
 * @route PUT api/user/:username
 * @desc Update a user's display name, profile pic, or spotify pic
 * @param username: String (the username of the user)
 * @body userDisplayName: String (the new display name of the user)
 * @body profilePic: String (the new profile pic of the user)
 * @body spotifyPic: String (the new spotify pic of the user)
 * @returns 204
 * @throws 404 If the user is not found
 * @throws 500 If there is an internal server error
 */
router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { userDisplayName, profilePic, spotifyPic } = req.body;
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
    if (spotifyPic) {
      await updateUserSpotifyPic(username, spotifyPic);
    }

    return res.status(204).json({ msg: "User updated" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route DELETE api/user/:username
 * @desc Delete a user
 * @param username: String (the username of the user)
 * @returns 204
 * @throws 404 If the user is not found
 * @throws 500 If there is an internal server error
 */
router.delete("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }

    //delete user from all studios
    const studios = user.userStudios;
    for (var i = 0; i < studios.length; i++) {
      await deleteUserFromStudio(studios[i], username);
    }
    await deleteUser(username);

    return res.status(204).json({ msg: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route PUT api/user/:username/logout
 * @desc Log a user out
 * @param username: String (the username of the user)
 * @returns 204
 * @throws 404 If the user is not found
 * @throws 500 If there is an internal server error
 */
router.put("/:username/logout", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    
    //set user to inactive
    await setUserInactive(username);
    user.userStudios.forEach(async (studio) => {
      await setStudioStatus(studio);
    });

    return res.status(204).json({ msg: "User logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search methods

/**
 * @route GET api/user/:username/:query
 * @desc Search for users
 * @param username: String (the username of the user)
 * @param query: String (the query to search for)
 * @returns array of users
 * @throws 404 If the user is not found
 * @throws 500 If there is an internal server error
 */
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

/**
 * @route GET api/user/:username/:query/:studioId
 * @desc Search for users in a studio
 * @param username
 * @param query
 * @param studioId
 * @returns array of the users
 * @throws 404 If the user is not found
 * @throws 500 If there is an internal server error
 */
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

/**
 * @route GET api/user/:username/studios/:query
 * @desc Search all studios
 * @param username - username of user
 * @param query - search query
 * @return studios - array of studios
 * @throws 500 if Internal server error
 * @throws 404 if no user found
 */
router.get("/:username/studios/:query", async (req, res) => {
  const { username, query } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    const studios = await searchStudios(username, query);
    return res.json(studios);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route GET api/user/:username/active/:query
 * @desc Search all active studios
 * @param username - username of user
 * @param query - search query
 * @return studios - array of studios
 * @throws 500 if Internal server error
 * @throws 404 if no user found
 */
router.get("/:username/active/:query", async (req, res) => {
  const { username, query } = req.params;
  try {
    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }

    const studios = await searchActiveStudios(username, query);
    return res.json(studios);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
