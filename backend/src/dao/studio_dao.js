import dotenv from "dotenv";
dotenv.config();
import { Studio } from "../database/schema.js";

async function createStudio(name, listeners, host, genres, photo, isHostOnly, playlist) {
  const newStudio = new Studio({
    studioName: name,
    studioIsActive: true,
    studioUsers: listeners,
    studioHost: host,
    studioGenres: genres,
    studioPicture: photo,
    studioControlHostOnly: isHostOnly,
    studioPlaylist: playlist,
  });
  const studio = await newStudio.save();
  return studio;
}

async function getStudio(id) {
	return await Studio.find({ _id: id });
}

async function deleteStudio(id) {
	return await Studio.deleteOne({ _id: id });
}

async function getStudios() {
	return await Studio.find();
}

async function updateStudioControlHostOnly(id, isHostOnly) {
	return await Studio.findOneAndUpdate(
		{ _id: id },
		{ studioControlHostOnly: isHostOnly },
		{ new: true }
	);
}

async function updateStudioIsActive(id, isActive) {
	return await Studio.findOneAndUpdate(
		{ _id: id },
		{ studioIsActive: isActive },
		{ new: true }
	);
}

async function updateStudioUsers(id, listeners) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioUsers: listeners }, { new: true });
}

async function updateStudioHost(id, host) {
	return await Studio.findOneAndUpdate({ _id: id }, { studioHost: host }, { new: true });
}

export {
	createStudio,
	getStudio,
	getStudios,
	updateStudioControlHostOnly,
	updateStudioIsActive,
	updateStudioUsers,
	updateStudioHost,
	deleteStudio,
};
