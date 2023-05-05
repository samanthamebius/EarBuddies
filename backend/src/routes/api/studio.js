import express from "express";
import fs from "fs";
import multer from "multer";
import { v4 as uuid } from "uuid";

import { createStudio, getStudio, deleteStudio, updateStudioNames, updateStudioUsers, updateStudioControlHostOnly } from "../../dao/studio_dao.js";
import { getUserId, getStudiosId, updateStudios, getUsername, updateStudiosUsername } from "../../dao/user_dao.js";

import { getSpotifyApi } from "../../dao/spotify_dao.js";
import { deleteChat, updateChatMessageDisplayName } from "../../dao/chat_dao.js";


const router = express.Router();

const upload = multer({
	dest: "./uploads",
});

//create studio
router.post("/new", async (req, res) => {
	try {
		const {
			name,
			listeners,
			host: host_name,
			genres,
			studioBannerImageUrl: coverPhoto,
			isHostOnly,
		} = req.body;

		//create studio playlist
		const playlist_name = "Earbuddies - " + name;
		const api = getSpotifyApi();
		if (!api) {
		console.log("No Spotify API connection")
		return res.status(403).json({ msg: "No Spotify API connection" });
		}
		api.createPlaylist(playlist_name, {'public': true})
		.then(async function(data) {
			const playlist_id = data.body.id;

			// Create the new studio
			const newStudio = await createStudio(
				name,
				listeners,
				host_name,
				genres,
				coverPhoto,
				isHostOnly,
				playlist_id
			);
			//add studios to user
			listeners.forEach(async (listener) => {
				const studios = await getStudiosId(listener);
				studios.push(newStudio._id);
				updateStudiosUsername(listener, studios);
			});
			// Respond with the newly created studio
			res.status(201).location(`/api/studio/${newStudio._id}`).json(newStudio);
		}, function(err) {
			console.log('Something went wrong!', err);
		});
		

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
		//check for spotify api connection
		const api = getSpotifyApi();
		if (!api) {
			return res.status(403).json({ msg: "No Spotify API connection" });
		}
		const studio = await getStudio(id);
		res.status(200).json(studio);
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
		//remove studio from users
		const studio = await getStudio(id);
		const listeners = studio[0].studioUsers;
		listeners.forEach(async (listener) => {
			const studios = await getStudiosId(listener);
			const newStudios = studios.filter((studio) => JSON.parse(JSON.stringify(studio._id)) !== id);
			await updateStudiosUsername(listener, newStudios);
		});
		//delete all chats
		await deleteChat(id);
		await deleteStudio(id);
		res.status(204);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/:id/toggle", async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ msg: "No studio id provided" });
		}
		const studio = await getStudio(id);
		const control = studio[0].studioControlHostOnly;
		const newControl = !control;
		const updated_studio = await updateStudioControlHostOnly(id, newControl);
		res.status(200).json(updated_studio);
	} catch (err) {
		res.status(500).json(err);
	}
});

// upload the image for the studio banner
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

// update nickname for user in studio
router.put("/:studioId/:userId/nickname", async (req, res) => {
	try {
		const { studioId, userId } = req.params;
		const nickname = req.body.nickname;
		const mongoId = await getUserId(userId);
		const studio = await getStudio(studioId);
		const users = studio[0].studioUsers;
		const userPos = users.indexOf(mongoId);

		const nicknames = studio[0].studioNames;
		nicknames[userPos] = nickname;
		await updateStudioNames(studioId, nicknames);

		// update the nickname for chat messages
		const updatedMessages = await updateChatMessageDisplayName(
			userId,
			studioId,
			nickname
		);

		res.status(200).json(updatedMessages);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get nickname for user in studio
router.get("/:studioId/:userId/nickname", async (req, res) => {
	try {
		const { studioId: id, userId } = req.params;
		const mongoId = await getUserId(userId);
		const studio = await getStudio(id);
		const users = studio[0].studioUsers;
		const userPos = users.indexOf(mongoId);
		const nickname = studio[0].studioNames[userPos];

		res.status(200).json(nickname);
	} catch (err) {
		res.status(500).json(err);
	}
});

//leave studio
router.put("/:studio_id/leave/:user", async (req, res) => {
  try {
    const { studio_id, user } = req.params;
    if (!studio_id) {
      return res.status(400).json({ msg: "No studio id provided" });
    }
    if (!user) {
      return res.status(400).json({ msg: "No user id provided" });
    }
    const studio = await getStudio(studio_id);
    const listeners = studio[0].studioUsers;

    //remove user from studio
    const newListeners = listeners.filter((listener) => listener !== JSON.parse(user));
    await updateStudioUsers(studio_id, newListeners);

    //remove studio from user
    const studios = await getStudiosId(JSON.parse(user));
    const newStudios = studios.filter((studio) => JSON.parse(JSON.stringify(studio._id)) !== studio_id);
	console.log(newStudios)
    updateStudiosUsername(JSON.parse(user), newStudios);

    res.status(200);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
