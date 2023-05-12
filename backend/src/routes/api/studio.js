import express from "express";
import fs from "fs";
import multer from "multer";
import { v4 as uuid } from "uuid";
import {
	createStudio,
	getStudio,
	deleteStudio,
	updateStudioUsers,
	updateStudioNames,
	updateStudioControlHostOnly,
	updateStudioHost,
	updateStudioPlaylist,
	removeStudioFromUsers,
	setNickname,
	updateStudioListeners,
} from '../../dao/studio_dao.js';
import { getUser, getStudiosId, updateStudios, addStudio } from "../../dao/user_dao.js";
import { getSpotifyApi, createNewStudioPlaylist, copyPlaylist, transferPlaylist, createStudioPlaylist } from "../../dao/spotify_dao.js";
import { Types as mongooseTypes } from "mongoose";
import {
	deleteChat,
	updateChatMessageDisplayName,
} from "../../dao/chat_dao.js";

const router = express.Router();

const upload = multer({
	dest: "./uploads",
});

/**
 * @route POST api/studio/new
 * @desc Create a new studio
 * @body 
 * 		name: String
 * 		listeners: [String]
 * 		host: String
 * 		genres: [String]
 * 		studioBannerImageUrl: String
 * 		isHostOnly: Boolean
 * @returns 201 The location of the newly created studio
 * @throws 400 if required fields are missing
 * @throws 403 if no Spotify API connection
 * @throws 500 if server error
 */
router.post("/new", async (req, res) => {
  try {
    const {
      name,
      listeners,
      host,
      genres,
      studioBannerImageUrl,
      isHostOnly,
    } = req.body;

    // Check for required fields
    if (!name || !listeners || !host) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields" });
    }

	//create studio 
	const playlist_id = await createStudioPlaylist(name);
    const newStudio = await createStudio(
      name,
      listeners,
      host,
      genres,
      studioBannerImageUrl,
      isHostOnly,
      playlist_id
    );

    // Add studios to user
    const promises = listeners.map(async (listener) => {
		await addStudio(listener, newStudio._id);
    });
    await Promise.all(promises);

    res.status(201).location(`/api/studio/${newStudio._id}`).json(newStudio);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route GET api/studio/:id
 * @desc Get a studio by id
 * @param id: String (Studio ID)
 * @returns 200 The studio
 * @throws 400 if invalid ID
 * @throws 403 if no Spotify API connection
 * @throws 404 if studio not found
 * @throws 500 if server error
 */
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongooseTypes.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid ID" });
		}

		const api = getSpotifyApi();
		if (!api) {
			return res.status(403).json({ msg: "No Spotify API connection" });
		}

		const studio = await getStudio(id);
		if (!studio) {
			return res.status(404).json({ msg: "Studio not found" });
		}

		res.status(200).json(studio);
	} catch (err) {
		console.log(err);
    	res.status(500).json({ msg: "Server error" });
	}
});

/**
 * @route DELETE api/studio/:id
 * @desc Delete a studio by id
 * @param id: String (Studio ID)
 * @returns 204
 * @throws 404 if studio not found
 * @throws 500 if server error
 */
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const studio = await getStudio(id);
		if (!studio) {
			return res.status(404).json({ msg: "Studio not found" });
		}
		await removeStudioFromUsers(studio);
		await deleteChat(id);
		await deleteStudio(id);

		res.status(204).json({msg: "studio deleted"});
	} catch (err) {
		console.log(err);
    	res.status(500).json({ msg: "Server error" });
	}
});

/**
 * @route PUT api/studio/:id/isHostOnly
 * @desc Update the isHostOnly field of a studio
 * @param id: String (Studio ID)
 * @returns 200
 * @throws 404 if studio not found
 * @throws 500 if server error
 */
router.put("/:id/isHostOnly", async (req, res) => {
	try {
		const { id } = req.params;
		const studio = await getStudio(id);
		if (!studio) {
			return res.status(404).json({ msg: "Studio not found" });
		}
		const control = studio[0].studioControlHostOnly;
		await updateStudioControlHostOnly(id, !control);

		res.status(200).json({msg: "control updated"});
	} catch (err) {
		console.log(err);
    	res.status(500).json({ msg: "Server error" });
	}
});

/**
 * @route POST api/studio/upload-image
 * @desc Upload an image to the server
 * @body image: File
 * @returns 201 The location of the newly created image
 */
router.post("/upload-image", upload.single("image"), (req, res) => {
	const oldPath = req.file.path;
	const extension = req.file.originalname.substring(
		req.file.originalname.lastIndexOf(".")
	);
	const newFileName = `${uuid()}${extension}`;
	const newPath = `./public/images/${newFileName}`;

	fs.renameSync(oldPath, newPath);

	res
		.status(201)
		.header("Location", `/images/${newFileName}`)
		.header("Access-Control-Expose-Headers", "Location")
		.send();
});

/**
 * @route PUT api/studio/:studioId/:userId/nickname
 * @desc Update the nickname of a user in a studio
 * @param studioId: String (Studio ID)
 * @param userId: String (User ID)
 * @body nickname: String
 * @returns 200 The updated messages and nickname
 * @throws 500 if server error
 */
router.put("/:studioId/:userId/nickname", async (req, res) => {
	try {
		const { studioId, userId } = req.params;
		const nickname = req.body.nickname;

		await setNickname(studioId, userId, nickname);
		const updatedMessages = await updateChatMessageDisplayName(
			userId,
			studioId,
			nickname
		);

		const data = { updatedMessages: updatedMessages, nickname: nickname };

		res.status(200).json(data);
	} catch (err) {
		res.status(500).json(err);
	}
});

/**
 * @route GET api/studio/:studioId/:userId/nickname
 * @desc Get the nickname of a user in a studio
 * @param studioId: String (Studio ID)
 * @param userId: String (User ID)
 * @returns 200 The nickname
 * @throws 500 if server error
 */
router.get("/:studioId/:userId/nickname", async (req, res) => {
	try {
		const { studioId, userId } = req.params;
		const studio = await getStudio(studioId);
		const userPos = studio[0].studioUsers.indexOf(userId);
		const nickname = studio[0].studioNames[userPos];

		res.status(200).json(nickname);
	} catch (err) {
		res.status(500).json(err);
	}
});

/**
 * @route PUT api/studio/:studioId/updateListeners
 * @desc Update the listeners of a studio
 * @param studioId: String (Studio ID)
 * @body listeners: Array of Strings (User IDs)
 * @returns 200 The updated studio
 * @throws 404 if studio not found
 * @throws 500 if server error
 */
router.put("/:studioId/updateListeners", async (req, res) => {
	try {
		const { studioId } = req.params;
		const listeners = req.body.listeners;

		const studio = await getStudio(studioId);
		if (!studio) {
			return res.status(404).json({ msg: "Studio not found" });
		}

		const updatedStudio = await updateStudioListeners(studioId, listeners);

		res.status(200).json(updatedStudio);
	} catch (err) {
		res.status(500).json(err);
	}
});

//leave studio
router.put("/:studio_id/leave/:username", async (req, res) => {
  try {
    const { studio_id, username } = req.params;
    const studio = await getStudio(studio_id);
	if (!studio) {
		return res.status(404).json({ msg: "Studio not found" });
	}
	const user = await getUser(JSON.parse(username));
	if (!user) {
		return res.status(404).json({ msg: "User not found" });
	}
    const listeners = studio[0].studioUsers;

	//remove user from nickname list
	const indexToRemove = listeners.indexOf(username.replace(/"/g, ""));
	const nicknames = studio[0].studioNames;
	const newArray = [
		...nicknames.slice(0, indexToRemove),
		...nicknames.slice(indexToRemove + 1),
	];
	updateStudioNames(studio_id, newArray);

    //remove user from studio
    const newListeners = listeners.filter((listener) => listener !== JSON.parse(username));
    await updateStudioUsers(studio_id, newListeners);

    //remove studio from user
    const studios = await getStudiosId(JSON.parse(username));
    const newStudios = studios.filter((studio) => JSON.parse(JSON.stringify(studio._id)) !== studio_id);
    updateStudios(JSON.parse(username), newStudios);

    res.status(200).json({ msg: "User left studio" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

//assign new host
router.put("/:studio_id/newHost/:host_name", async (req, res) => {
	console.log("new host");
  	try {
		const { studio_id, host_name } = req.params;
		const host = await getUser(host_name)
		if (!host) {
			return res.status(404).json({ msg: "Invalid host provided" });
		}
		const new_host = await transferPlaylist(studio_id, host_name);

		res.status(204).json({ msg: "Host Updated" })
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:studio_id/host", async (req, res) => {
	try {
		// get host username
		const { studio_id } = req.params;
		const studio = await getStudio(studio_id);
		const hostName = studio[0].studioHost;

		//get host user object
		const host = await getUser(hostName);
		res.status(200).json(host);
	} catch (err) {
		res.status(500).json(err);
	}
});

//remove a user from a studio
router.delete("/:studio_id/:username", async (req, res) => {
	try {
		const { studio_id, username } = req.params;
		const studio = await getStudio(studio_id);
		if (!studio) {
			return res.status(404).json({ msg: "Studio not found" });
		}
		const user = await getUser(username);
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		// remove the studio from the user
		const studios = await getStudiosId(username);
		const newStudios = studios.filter((studio) => JSON.parse(JSON.stringify(studio._id)) !== studio_id);
		updateStudios(username, newStudios);
		
		// remove the user from the studio
		const listeners = studio[0].studioUsers;
		const newListeners = listeners.filter((listener) => listener !== username);
		await updateStudioUsers(studio_id, newListeners);

		//remove user from nickname list
		const indexToRemove = listeners.indexOf(username);
		const nicknames = studio[0].studioNames;
		const newStudioNames = [
			...nicknames.slice(0, indexToRemove),
			...nicknames.slice(indexToRemove + 1),
		];
		updateStudioNames(studio_id, newStudioNames);
		
		res.status(204).json({ msg: "User removed from studio" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Server error" });
	}
});

// add a user from a studio
router.put("/:studio_id/:username", async (req, res) => {
	try {
		const { studio_id, username } = req.params;
		const studio = await getStudio(studio_id);
		if (!studio) {
			return res.status(404).json({ msg: "Studio not found" });
		}
		const user = await getUser(username);
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		// add the studio to the user
		const studios = await getStudiosId(username);
		studios.push(studio_id);
		updateStudios(username, studios);

		// add user to studio
		studio[0].studioUsers.push(username);
		updateStudioUsers(studio_id, studio[0].studioUsers);
		
		
		studio[0].studioNames.push(user.userDisplayName);
		updateStudioNames(studio_id, studio[0].studioNames);
		
		res.status(204).json({ msg: "User removed from studio" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Server error" });
	}
});

export default router;
