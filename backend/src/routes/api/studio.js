import express from "express";
import fs from "fs";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { createStudio, getStudio, deleteStudio, updateStudioUsers, updateStudioControlHostOnly, updateStudioHost } from "../../dao/studio_dao.js";
import { getUser, getStudiosId, updateStudios } from "../../dao/user_dao.js";
import { getSpotifyApi } from "../../dao/spotify_dao.js";
import { deleteChat } from "../../dao/chat_dao.js";
import { Types as mongooseTypes } from "mongoose";

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

    // Create studio playlist on Spotify
    const playlist_name = "Earbuddies - " + name;
    const api = getSpotifyApi();
    if (!api) {
      console.log("No Spotify API connection");
      return res.status(403).json({ msg: "No Spotify API connection" });
    }
    const createPlaylistRes = await api.createPlaylist(playlist_name, {
      public: true,
    });
    const playlist_id = createPlaylistRes.body.id;

    // Create the new studio
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
		const thisListener = await getUser(listener);
		if (!thisListener) {
			return res.status(404).json({ msg: "Listener not found" });
		}
      const studios = await getStudiosId(listener);
      studios.push(newStudio._id);
      await updateStudios(listener, studios);
    });
    await Promise.all(promises);

    // Respond with the newly created studio
    res.status(201).location(`/api/studio/${newStudio._id}`).json(newStudio);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

//get studio by id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongooseTypes.ObjectId.isValid(id)) {
		// Invalid ID, return an error response
			return res.status(400).json({ error: "Invalid ID" });
		}
		//check for spotify api connection
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

//delete studio by id
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const studio = await getStudio(id);
		if (!studio) {
			return res.status(404).json({ msg: "Studio not found" });
		}
		//remove studio from users
		const listeners = studio[0].studioUsers;
		listeners.forEach(async (listener) => {
			const studios = await getStudiosId(listener);
			const newStudios = studios.filter((studio) => JSON.parse(JSON.stringify(studio._id)) !== id);
			await updateStudios(listener, newStudios);
		});
		//delete all chats
		await deleteChat(id);
		await deleteStudio(id);
		res.status(204).json({msg: "studio deleted"});
	} catch (err) {
		console.log(err);
    	res.status(500).json({ msg: "Server error" });
	}
});

router.post("/:id/toggle", async (req, res) => {
	try {
		const { id } = req.params;
		const studio = await getStudio(id);
		if (!studio) {
		return res.status(404).json({ msg: "Studio not found" });
		}
		const control = studio[0].studioControlHostOnly;
		const newControl = !control;
		const updated_studio = await updateStudioControlHostOnly(id, newControl);
		res.status(200).json(updated_studio);
	} catch (err) {
		console.log(err);
    	res.status(500).json({ msg: "Server error" });
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

//leave studio
router.put("/:studio_id/leave/:username", async (req, res) => {
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
    const listeners = studio[0].studioUsers;

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

// assign new host
router.put("/:studio_id/newHost/:host_name", async (req, res) => {
	console.log("new host");
  	try {
		const { studio_id, host_name } = req.params;
		const host = await getUser(host_name)
		if (!host) {
			return res.status(404).json({ msg: "Invalid host provided" });
		}
		await updateStudioHost(studio_id, host_name);
		res.status(204).json({ msg: "Host Updated" })
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
