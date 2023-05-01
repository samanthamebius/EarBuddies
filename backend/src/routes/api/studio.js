import express from "express";
import fs from "fs";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { createStudio, getStudio, deleteStudio } from "../../dao/studio_dao.js";
import { getUserId, getStudios, updateStudios } from "../../dao/user_dao.js";
import { getSpotifyApi } from "../../dao/spotify_dao.js";

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
			studioBannerImageUrl: coverPhoto,
			isHostOnly,
		} = req.body;

		// Get the user IDs for the host and listeners
		const hostUserId = await getUserId(host);
		const listenerUserIds = await Promise.all(listeners.map(getUserId));

		// Create the new studio
		const newStudio = await createStudio(
			name,
			listenerUserIds,
			hostUserId,
			genres,
			coverPhoto,
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
		const studio = await deleteStudio(id);
		res.status(204).json(studio);
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
	// do something
	console.log("file path");
	console.log(req.file.path);
	console.log("original name");
	console.log(req.file.originalname);

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

export default router;
